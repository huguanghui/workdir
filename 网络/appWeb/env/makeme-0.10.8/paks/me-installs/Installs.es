/*
    Installs.es - Installs plugin to create installable packages

    Copyright (c) All Rights Reserved. See copyright notice at the bottom of the file.
 */

module embedthis.me {

require ejs.tar
require ejs.unix
require ejs.zlib

class InstallsInner {
    let VER_FACTOR = 1000

    function InstallsInner() { }

    /*
        Deploy processes a manifest and copies files as directed.
        Manifest items are NOT targets. But they share the same property set as 'file' type targets.
        Manifest items support the following extra options:

        set     The file set the item is part of
        write   Write an expanded string literal to the destination
     */
    public function deploy(manifest, package): Array {
        let sets = me.options.sets 
        if (me.options.deploy) {
            sets ||= package['sets-cross'] 
        } else {
            sets ||= package.sets
        }
        if (!makeme.generating) {
            trace('Copy', 'File sets: ' + sets)
        }
        let home = App.dir
        if (manifest.home) {
            App.chdir(manifest.home)
        } else {
            App.chdir(me.dir.top)
        }
        let filelist = []
        for each (let set in sets) {
            let set = manifest.sets[set]
            for each (item in set) {
                if (item.linkin) {
                    trace('Warn', 'Manifest uses "linkin" property. Use "symlink" instead')
                    dump(item)
                }
                if (item.dir) {
                    print('WARNING: using deprecated "dir" property in manifest. Use "mkdir" instead')
                    dump(item)
                }
                if (item.copy) {
                    print('WARNING: using deprecated "copy" property in manifest. Use "perform" instead')
                    dump(item)
                }
                if (item.precopy) {
                    print('WARNING: using deprecated "precopy" property in manifest. Use "prePerform" instead')
                    item.prePerform = eval('(function(from, to, options) {' + item.precopy + ';})')
                }
                if (item.postcopy) {
                    print('WARNING: using deprecated "postcopy" property in manifest. Use "postPerform" instead')
                    print("EVAL", 'function(from, to, options) {' + item.postcopy + '\n}')
                    item.postPerform = eval('(function(from, to, options) {' + item.postcopy + ';})')
                }
                for (let [key,value] in item) {
                    if (value is String && value.contains('${') /*}*/) {
                        item[key] = makeme.loader.expand(value)
                    }
                }
                let prior = App.dir
                if (item.home) {
                    App.chdir(makeme.loader.expand(item.home))
                }
                if (item.ifdef && !(item.ifdef is Array)) {
                    item.ifdef = [item.ifdef]
                }
                if (item.mkdir && !(item.mkdir is Array)) {
                    item.mkdir = [item.mkdir]
                }
                item.filelist = filelist
                if (me.options.verbose) {
                    dump("Consider", item)
                }
                let name = item.name || item.from || serialize(item)
                let enable = true

                for each (r in item.ifdef) {
                    if (!makeme.generating) {
                        if ((!me.targets[r] || !me.targets[r].enable)) {
                            skip(name, 'Required component ' + r + ' is not enabled')
                            enable = false
                            break
                        }
                    }
                } 
                if (enable && item.enable) {
                    if (!(item.enable is Boolean)) {
                        let script = makeme.loader.expand(item.enable)
                        try {
                            enable = eval(script) cast Boolean
                        } catch (e) {
                            vtrace('Enable', 'Cannot run enable script for ' + name)
                            App.log.debug(3, e)
                            skip(name, 'Enable script failed to run')
                            enable = false
                        }
                    }
                } else if (item.enable === false) {
                    enable = false
                }
                if (enable && App.uid != 0 && item.root && (me.installing || me.uninstalling) && !makeme.generating) {
                    trace('Skip', 'Must be root ' + name)
                    skip(name, 'Must be administrator')
                    enable = false
                }
                if (!enable) {
                    continue
                }
                try {
                    if (!item.from && item.prePerform) {
                        item.prePerform.call(me.dir.top, item.from, item.to, item)
                    }
                    if (item.ifdef && makeme.generating) {
                        for each (r in item.ifdef) {
                            if (me.platform.os == 'windows') {
                                genCmd('!IF "$(ME_COM_' + r.toUpper() + ')" == "1"')
                            } else {
                                genCmd('if [ "$(ME_COM_' + r.toUpper() + ')" = 1 ]; then true')
                            }
                        }
                    }
                    for each (let dir:Path in item.mkdir) {
                        dir = makeme.loader.expand(dir)
                        strace('Create', dir.relativeTo(me.dir.top))
                        makeDirectory(dir, item)
                    }
                    if (item.from) {
                        copyFiles(item.from, item.to, item, '.')
                    } else if (item.perform) {
                        item.prePerform && item.prePerform.call(me.dir.top, item.from, item.to, item)
                        item.perform.call(me.dir.top, item.from, item.to, item)
                    }
                    if (item.write) {
                        item.to = Path(makeme.loader.expand(item.to))
                        let data = makeme.loader.expand(item.write)
                        if (makeme.generating) {
                            data = data.replace(/\n/g, '\\n')
                            genScript("echo -e '" + data + "' >" + item.to)
                        } else {
                            strace('Create', item.to)
                            item.to.write(data)
                            filelist.push(item.to)
                        }
                    }
                    if (item.ifdef && makeme.generating) {
                        for each (r in item.ifdef.length) {
                            if (me.platform.os == 'windows') {
                                genCmd('!ENDIF')
                            } else {
                                genCmd('fi')
                            }
                        }
                    }
                    if (item.postPerform) {
                        item.postPerform.call(me.dir.top, item.from, item.to, item)
                    }
                } catch (e) {
                    print(e)
                    print('WARNING: error with item:')
                    dump(item)
                }
                App.chdir(prior)
            }
        }
        App.chdir(home)
        return filelist
    }

    function setupGlobals(manifest, package, prefixes) {
        for (pname in prefixes) {
            if (package.prefixes.contains(pname)) {
                me.globals[pname] = prefixes[pname]
                if (!makeme.generating) {
                    if (me.target.name != 'uninstall') {
                        let prefix = Path(prefixes[pname])
                        if (pname == 'vapp' || pname == 'web' || pname == 'spool' || pname == 'src' || pname == 'staging') {
                            if (prefix.exists) {
                                if (prefix.toString().contains(me.settings.name)) {
                                    safeRemove(prefix)
                                }
                            }
                        }
                        if (me.installing || me.uninstalling) {
                            checkRoot(manifest)
                        }
                        if (!prefixes[pname].exists) {
                            if (prefixes[pname].contains(me.settings.name)) {
                                prefixes[pname].makeDir()
                            }
                        }
                    }
                }
            }
        }
        me.globals.media = prefixes.media
        me.globals.staging = prefixes.staging

        if (prefixes.vapp) {
            me.globals.abin = prefixes.vapp.join('bin')
            me.globals.adoc = prefixes.vapp.join('doc')
            me.globals.ainc = prefixes.vapp.join('inc')
        }
        if (me.options.verbose) {
            dump("Globals", me.globals)
        }
    }

    function setupManifest(kind, package, prefixes) {
        let manifest
        if (package.inherit) {
            let inherit = me[package.inherit]
            manifest = me.manifest.clone()
            for (let [key,value] in manifest.sets) {
                if (!key.match(/^[\+\-\=]/)) {
                    manifest.sets['+' + key] = value
                    delete manifest.sets[key]
                }
            }
            manifest = blend(inherit.clone(), manifest, {combine: true})
            package.prefixes = (inherit.packages[kind].prefixes + package.prefixes).unique()
        } else {
            manifest = me.manifest.clone()
        }
        return manifest
    }

    function setupPrefixes(kind, package) {
        let prefixes = {}
        if (me.installing || me.uninstalling) {
            prefixes = me.prefixes.clone()
            prefixes.staging = me.prefixes.app
            prefixes.media = prefixes.app
        } else {
            me.platform.vname = me.settings.name + '-' + me.settings.version
            prefixes.staging = me.dir.pkg.join(kind)
            prefixes.media = prefixes.staging.join(me.platform.vname)
            safeRemove(prefixes.staging)
            for (pname in me.prefixes) {
                if (package.prefixes.contains(pname)) {
                    if (pname == 'src') {
                        prefixes[pname] = prefixes.media.portable.normalize
                    } else {
                        prefixes[pname] = Path(prefixes.media.join('contents').portable.name + 
                            me.prefixes[pname].removeDrive().portable).normalize
                    }
                }
            }
        }
        if (me.options.verbose) {
            dump("Prefixes", prefixes)
        }
        return prefixes
    }

    public function setupInstall(kind) {
        if (me.settings.manifest) {
            makeme.loader.blendFile(me.dir.top.join(me.settings.manifest))
            makeme.loader.runScript('loaded')
        }
        let package = me.manifest.packages[kind]
        if (package && package.platforms) {
            if (!(package.platforms.contains(me.platform.os) || package.platforms.contains(me.platform.like))) {
                package = null
            }
        }
        let prefixes, manifest
        if (package) {
            prefixes = setupPrefixes(kind, package)
            manifest = setupManifest(kind, package, prefixes)
            setupGlobals(manifest, package, prefixes)
            if (!me.installing) {
                me.dir.rel.makeDir()
            }
        } else {
            vtrace('Info', 'Skip creating ' + kind + ' package')
        }
        return [manifest, package, prefixes]
    }

    function makeFilesLog(where, root, files, prefixes) {
        if (!makeme.generating && !me.options.deploy && me.manifest.log != false) {
            let flog = where.join('files.log')
            files += [flog]
            files = files.sort().unique().filter(function(f) f.startsWith(root))
            files = files.map(function(f) '/' + f.relativeTo(root))
            flog.write(files.join('\n') + '\n')
            flog.perms = 0700
        }
    }

    public function packageBinary() {
        let [manifest, package, prefixes] = setupInstall('binary')
        if (package) {
            trace('Create', me.settings.title + ' Binary')
            let files = deploy(manifest, package)
            makeFilesLog(prefixes.vapp ? prefixes.vapp : prefixes.app, prefixes.root, files, prefixes)
            /* Do Tar first as native package will add files */
            let binary = manifest.packages.binary
            if (binary.formats.contains('tar')) {
                makeTarInstall(prefixes)
            }
            if (binary.formats.contains('native')) {
                makeNativeInstall(prefixes)
            }
        }
    }

    public function packageSource() {
        let [manifest, package, prefixes] = setupInstall('source')
        if (package) {
            trace('Create', me.settings.title + ' Source')
            deploy(manifest, package)
            makeSimpleInstall(package, prefixes, 'src')
        }
    }

    function cacheInstall(package, prefixes, fmt) {
        let dist = me.dir.top.join('dist')
        let staging = prefixes.staging.absolute
        let base = staging.join(me.platform.vname)
        let name = me.settings.name
        let package = base.join('package.json')
        let version
        if (package.exists) {
            version = package.readJSON().version
        }
        if (!version) {
            let pak = base.join('pak.json')
            version = pak.readJSON().version
        }
        trace('Cache', me.settings.title + ' ' + version)

        if (dist.exists) {
            for each (f in dist.files('**', {depthFirst: true})) {
                f.remove()
            }
            let from = base.join('dist')
            from.operate('**', dist, {relative: from})
            run('pak -f -q cache')
        } else {
            let home = App.dir
            try {
                App.chdir(staging)
                run('pak -q -f cache ' + me.platform.vname)
            } finally {
                App.chdir(home)
            }
        }
    }

    public function cache() {
        let [manifest, package, prefixes] = setupInstall('pak')
        if (package) {
            trace('Package', me.settings.title + ' Pak')
            deploy(manifest, package)
            cacheInstall(package, prefixes, 'pak')
        }
    }

    public function packagePak() {
        let [manifest, package, prefixes] = setupInstall('pak')
        if (package) {
            trace('Package', me.settings.title + ' Pak')
            deploy(manifest, package)
            makeSimpleInstall(package, prefixes, 'pak')
        }
    }

    function checkRoot(manifest = { root: true }) {
        if (!makeme.generating && me.prefixes.root.same('/') && manifest.root && App.uid != 0 && Config.OS != 'windows') {
            throw 'Must run as root. Use "sudo me install".'
        }
    }

    public function installBinary() {
        if (me.options.deploy && me.settings.platforms.length > 1 && !me.platform.cross) {
            trace('Skip', 'Deploy for ' + me.platform.name)
            return
        }
        me.installing = true
        let [manifest, package, prefixes] = setupInstall('install')
        if (package) {
            checkRoot(manifest)
            if (!makeme.generating) {
                if (me.options.deploy) {
                    trace('Deploy', me.settings.title + ' to "' + me.prefixes.root + '"')
                } else {
                    trace('Install', me.settings.title)
                }
            }
            files = deploy(manifest, package) 
            makeFilesLog(prefixes.vapp ? prefixes.vapp : prefixes.app, prefixes.root, files, me.prefixes)
        }
        delete me.installing
    }

    public function uninstallBinary() {
        me.uninstalling = true
        let [manifest, package, prefixes] = setupInstall('binary', true)
        let name = (me.platform.os == 'windows') ? me.settings.title : me.settings.name
        if (package) {
            checkRoot(manifest)
            if (!makeme.generating) {
                trace('Uninstall', me.settings.title)
            }
            let fileslog = prefixes.vapp ? prefixes.vapp.join('files.log') : prefixes.app.join('files.log')
            if (makeme.generating) {
                for each (n in ['web', 'spool', 'cache', 'log']) {
                    if (package.prefixes.contains(n)) {
                        removeDir(me.prefixes[n])
                    }
                }
                removeDir(me.prefixes.vapp)
            } else {
                if (fileslog && fileslog.exists) {
                    for each (let file: Path in fileslog.readLines()) {
                        if (!file.isDir) {
                            removeFile(file)
                        }
                    }
                    fileslog.remove()
                }
                if (me.prefixes.log) {
                    for each (file in me.prefixes.log.files('*.log*')) {
                        removeFile(file)
                    }
                }
            }
            for (let [key, prefix] in me.prefixes) {
                /* 
                    Safety, make sure product name is in prefix 
                 */
                if (!prefix.name.contains(name) || key == 'src' || key == 'app' || !prefixes[key]) {
                    continue
                }
                if (!package.prefixes.contains(key)) {
                    continue
                }
                if (makeme.generating) {
                    if (key == 'vapp') {
                        continue
                    }
                } else {
                    for each (dir in prefix.files('**', {include: /\/$/}).sort().reverse()) {
                        removeDir(dir, {empty: true})
                    }
                }
                removeDir(prefix, {empty: true})
            }
            if (me.prefixes.vapp != me.prefixes.app) {
                updateLatestLink()
            }
            removeDir(me.prefixes.app, {empty: true})

            if (!makeme.generating) {
                let sets = me.options.sets  || package.sets
                for each (let set in sets) {
                    let set = manifest.sets[set]
                    for each (item in set) {
                        if (item.symlink) {
                            let from = item.from
                            if (!(from is Array)) from = [from]
                            for each (file in from) {
                                let path = Path(item.symlink).join(file)
                                path = makeme.loader.expand(path)
                                for each (link in Path('/').files(path)) {
                                    if (link.isLink) {
                                        safeRemove(link)
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    /* Only used for uninstalling */
    function updateLatestLink() {
        let latest = me.prefixes.app.join('latest')
        let version
        if (!makeme.generating) {
            version = me.prefixes.app.files('*', {include: /\d+\.\d+\.\d+/}).sort().pop()
        }
        if (version) {
            version.basename.link(latest)
        } else {
            removeFile(latest)
        }
    }

    function makeSimpleInstall(package, prefixes, fmt) {
    /*
        if (fmt == 'pak') {
            let base = prefixes.staging.join(me.platform.vname)
            let package = base.join('package.json')
        }
        */
        let name = me.dir.rel.join(me.platform.vname + '-' + fmt + '.tar')
        let zname = name.replaceExt('tgz')
        let options = {relativeTo: prefixes.staging, user: 'root', group: 'root', uid: 0, gid: 0}
        let tar = new Tar(name, options)
        tar.create(prefixes.staging.files('**', {exclude: /\/$/, missing: undefined}))
        Zlib.compress(tar.name, zname)
        if (!me.options.keep) {
            name.remove()
        }
        trace('Package', zname.relativeTo(me.dir.top))

        let generic = me.dir.rel.join(me.settings.name + '-' + fmt + '.tgz')
        generic.remove()
        zname.basename.link(generic)

        let sumline = checksum(zname) + ' ' + zname.basename + '\n'
        me.dir.rel.join('sha256-' + me.platform.vname + '-' + fmt + '.tgz.txt').write(sumline)
        sumline = md5sum(zname) + ' ' + zname.basename + '\n'
        me.dir.rel.join('md5-' + me.platform.vname + '-' + fmt + '.tgz.txt').write(sumline)

        trace('Package', generic.relativeTo(me.dir.top))
    }

    public function packageName() {
        let s = me.settings
        let p = me.platform
        if (Config.OS == 'macosx') {
            name = s.name + '-' + s.version + '-' + p.dist + '-' + p.os + '-' + p.arch + '.pkg'
        } else if (Config.OS == 'windows') {
            name = s.name + '-' + s.version + '-' + p.dist + '-' + p.os + '-' + p.arch + '.exe.zip'
        } else {
            return null
        }
        return me.dir.rel.join(name)
    }

    public function installPackage() {
        let s = me.settings
        let package = packageName()
        if (Config.OS == 'macosx') {
            checkRoot()
            trace('Install', package.basename)
            run('installer -target / -package ' + package, {filter: true})

        } else if (Config.OS == 'windows') {
            trace('Install', package.basename)
            package.trimExt().remove()
            run(['unzip', '-q', package], {dir: me.dir.rel})
            run([package.trimExt(), '/verysilent'], {filter: true})
            package.trimExt().remove()
        }
    }

    public function uninstallPackage() {
        if (Config.OS == 'macosx') {
            checkRoot()
            if (me.prefixes.vapp.join('bin/uninstall').exists) {
                trace('Uninstall', me.prefixes.vapp.join('bin/uninstall'))
                run([me.prefixes.vapp.join('bin/uninstall')], {filter: true})
            }
        } else {
            let uninstall = me.prefixes.vapp.files('unins*.exe')[0]
            if (uninstall) {
                trace('Uninstall', uninstall)
                run([uninstall, '/verysilent'], {filter: true})
            }
        }
    }

    public function whatsInstalled() {
        for each (prefix in me.prefixes) {
            if (prefix.exists && prefix.contains(me.settings.name)) {
                trace('Exists', prefix)
                let files = prefix.files('**')
                if (files.length > 0) {
                    vtrace('Exists', files.join(', '))
                }
            }
        }
    }

    function makeTarInstall(prefixes) {
        let base = [me.settings.name, me.settings.version, me.platform.dist, me.platform.os, me.platform.arch].join('-')
        let name = me.dir.rel.join(base).joinExt('tar', true)
        let zname = name.replaceExt('tgz')
        let files = prefixes.staging.files('**', {exclude: /\/$/, missing: undefined})

        let options = {relativeTo: prefixes.staging, user: 'root', group: 'root', uid: 0, gid: 0}
        let tar = new Tar(name, options)
        trace('Package', zname.relativeTo(me.dir.top))
        tar.create(files)
        Zlib.compress(name, zname)
        name.remove()

        let sumline = checksum(zname) + ' ' + zname.basename + '\n'
        me.dir.rel.join('sha256-' + base).joinExt('tgz.txt', true).write(sumline)
        sumline = md5sum(zname) + ' ' + zname.basename + '\n'
        me.dir.rel.join('md5-' + base).joinExt('tgz.txt', true).write(sumline)

        let generic = me.dir.rel.join(me.settings.name + '-tar' + '.tgz')
        generic.remove()
        zname.basename.link(generic)
    }

    function makeNativeInstall(prefixes) {
        let os = (me.cross) ? me.platform.dev : me.platform.os
        switch (me.platform.os) {
        case 'macosx':
            packageMacosx(prefixes)
            break
        case 'windows':
            packageWindows(prefixes)
            break
        case 'linux':
            if (me.dir.top.join('installs/linux').exists) {
                packageUbuntu(prefixes)
            }
            break
        default:
            trace('Info', 'Cannot create native package for ' + me.platform.os)
        }
    }

    function createMacContents(prefixes) {
        let staging = prefixes.staging
        let s = me.settings
        let cp: File = staging.join(s.name + '.pmdoc', '01contents-contents.xml').open('w')
        cp.write('<pkg-contents spec="1.12">')
        cp.write('<f n="contents" o="root" g="wheel" p="16877" pt="' + prefixes.root + '" m="false" t="file">')
        for each (dir in prefixes.root.files('*', {include: /\/$/, missing: undefined})) {
            inner(staging, cp, dir)
        }

        function inner(prefixes, cp: File, dir: Path) {
            let perms = dir.attributes.permissions cast Number
            cp.write('<f n="' + dir.basename + '" o="root" g="wheel" p="' + perms + '" />')
            for each (f in dir.files()) {
                if (f.isDir) {
                    inner(staging, cp, f)
                } else {
                    perms = f.attributes.permissions cast Number
                    cp.write('<f n="' + f.basename + '" o="root" g="wheel" p="' + perms + '" />')
                }
            }
            cp.write('</f>')
        }
        cp.write('</pkg-contents>\n')
        cp.close()
    }

    function packageMacosx(prefixes) {
        let staging = prefixes.staging
        let s = me.settings
        let base = [s.name, s.version, me.platform.dist, me.platform.os, me.platform.arch].join('-')
        let name = me.dir.rel.join(base).joinExt('tar', true)
        let files = staging.files('**', {exclude: /\/$/, missing: undefined})
        let size = 20
        for each (file in staging.files('**', {exclude: /\/$/, missing: undefined})) {
            size += ((file.size + 999) / 1000)
        }
        me.PACKAGE_SIZE = size
        let opak = me.dir.top.join('installs/macosx')
        copyFiles(opak.join('background.png'), staging)
        for each (f in opak.files('*.rtf')) {
            copyFiles(f, staging)
        }
        let pm = s.name + '.pmdoc'
        let pmdoc = staging.join(pm)
        if (opak.join(pm).exists) {
            copyFiles(opak.join(pm + '/*'), pmdoc, {patch: true, hidden: true})
            createMacContents(prefixes)
        }
        let scripts = staging.join('scripts')
        scripts.makeDir()
        copyFiles(opak.join('scripts/*'), scripts, {patch: true})

        /* Remove extended attributes */
        Cmd.sh("cd " + staging + "; for i in $(ls -Rl@ | grep '^    ' | awk '{print $1}' | sort -u); do \
            find . | xargs xattr -d $i 2>/dev/null ; done")

        let outfile = me.dir.rel.join(base).joinExt('pkg', true)
        trace('Package', outfile.relativeTo(me.dir.top))
        if (opak.join(pm).exists) {
            let pmaker = Cmd.locate('PackageMaker.app', [
                '/Applications',
                '/Applications/Utilities',
                '/Xcode4/Applications/Utilities',
                '/Developer/Applications/Utilities'
            ])
            pmaker = pmaker.join('Contents/MacOS/PackageMaker')
            if (!pmaker) {
                throw 'Cannot locate PackageMaker.app'
            }
            run(pmaker + ' --target 10.5 --domain system --doc ' + pmdoc + 
                ' --id com.' + s.company + '.' + s.name + '.pkg --root-volume-only --no-relocate' +
                ' --discard-forks --out ' + outfile)
        } else {
            copyFiles(opak.join('distribution.xml'), staging, {patch: true})
            let sign = ''
            let signas = s.signas || s.company
            if (App.uid == 0 && signas) {
                sign += '--sign "Developer ID Installer: ' + signas + '"'
            }
            run('pkgbuild --quiet --install-location / ' + 
                '--root ' + staging.join(s.name + '-' + s.version, 'contents') + ' ' + 
                '--identifier com.' + s.company + '.' + s.name + '.pkg ' +
                '--version ' + makeVersion(s.version) + ' ' +
                '--scripts ' + scripts + ' ' + staging.join(s.name + '.pkg'))

            run('productbuild --quiet ' + sign + ' ' +
                '--distribution ' + staging.join('distribution.xml') + ' ' + 
                '--package-path ' + staging + ' ' + 
                '--resources ' + staging + ' ' + outfile)

            if (sign) {
                run('pkgutil --check-signature ' + outfile, {filter: true})
            }
        }
        let sumline = checksum(outfile) + ' ' + outfile.basename + '\n'
        me.dir.rel.join('sha256-' + base).joinExt('pkg.txt', true).write(sumline)
        sumline = md5sum(outfile) + ' ' + outfile.basename + '\n'
        me.dir.rel.join('md5-' + base).joinExt('pkg.txt', true).write(sumline)
    }

    function packageFedora(prefixes) {
        let pmaker = Cmd.locate('rpmbuild')
        if (!pmaker) {
            throw 'Cannot locate rpmbuild'
        }
        let home = App.getenv('HOME')
        App.putenv('HOME', me.dir.out)

        let staging = prefixes.staging
        let s = me.settings
        let cpu = me.platform.arch
        if (cpu.match(/^i.86$|x86/)) {
            cpu = 'i386'
        } else if (cpu == 'x64') {
            cpu = 'x86_64'
        }
        me.platform.mappedCpu = cpu
        let base = [s.name, s.version, me.platform.dist, me.platform.os, me.platform.arch].join('-')

        let RPM = prefixes.media.join('RPM')
        for each (d in ['SOURCES', 'SPECS', 'BUILD', 'RPMS', 'SRPMS']) {
            RPM.join(d).makeDir()
        }
        RPM.join('RPMS', me.platform.arch).makeDir()
        me.prefixes.rpm = RPM
        me.prefixes.content = prefixes.root

        let opak = me.dir.top.join('installs/' + me.platform.os)
        let spec = RPM.join('SPECS', base).joinExt('spec', true)
        copyFiles(opak.join('rpm.spec'), spec, {patch: true, permissions: 0644})

        let files = prefixes.root.files('**')
        let fileList = RPM.join('BUILD/binFiles.txt')
        let cp: File = fileList.open('atw')
        cp.write('%defattr(-,root,root)\n')

        let owndirs = RegExp(me.settings.name)
        /* Exclude everything under latest */
        for each (file in prefixes.root.files('**/', {relative: true, include: owndirs, exclude: /\/latest/})) {
            cp.write('%dir /' + file + '\n')
        }
        /* Exclude directories and everything under latest, but include latest itself */
        for each (file in prefixes.root.files('**', {exclude: /\/$|\/latest\//})) {
            cp.write('"/' + file.relativeTo(prefixes.root) + '"\n')
        }
        for each (file in prefixes.root.files('**/.*', {hidden: true})) {
            file.remove()
        }
        cp.close()

        let macros = me.dir.out.join('.rpmmacros')
        macros.write('%_topdir ' + RPM + '

    %__os_install_post /usr/lib/rpm/brp-compress %{!?__debug_package:/usr/lib/rpm/brp-strip %{__strip}} /usr/lib/rpm/brp-strip-static-archive %{__strip} /usr/lib/rpm/brp-strip-comment-note %{__strip} %{__objdump} %{nil}')
        let outfile = me.dir.rel.join(base).joinExt('rpm', true)
        trace('Package', outfile)
        run(pmaker + ' -ba --target ' + cpu + ' ' + spec.basename, {dir: RPM.join('SPECS'), filter: true})
        let rpmfile = RPM.join('RPMS', cpu, [s.name, s.version].join('-')).joinExt(cpu + '.rpm', true)
        rpmfile.rename(outfile)

        let sumline = checksum(outfile) + ' ' + outfile.basename + '\n'
        me.dir.rel.join('sha256-' + base).joinExt('rpm.txt', true).write(outline)
        sumline = md5sum(outfile) + ' ' + outfile.basename + '\n'
        me.dir.rel.join('md5-' + base).joinExt('rpm.txt', true).write(outline)

        App.putenv('HOME', home)
    }

    function packageUbuntu(prefixes) {
        let pmaker = Cmd.locate('dpkg')
        if (!pmaker) {
            throw 'Cannot locate dpkg'
        }
        let cpu = me.platform.arch
        if (cpu.match(/^i.86$|x86/)) {
            cpu = 'i386'
        } else if (cpu == 'x64') {
            cpu = 'amd64'
        }
        me.platform.mappedCpu = cpu
        let s = me.settings
        let base = [s.name, s.version, me.platform.dist, me.platform.os, me.platform.arch].join('-')

        let DEBIAN = prefixes.root.join('DEBIAN')
        let opak = me.dir.top.join('installs/' + me.platform.os)

        copyFiles(opak.join('deb.bin/conffiles'), DEBIAN.join('conffiles'), {patch: true, permissions: 0644})
        copyFiles(opak.join('deb.bin/control'), DEBIAN, {patch: true, permissions: 0755})
        copyFiles(opak.join('deb.bin/p*'), DEBIAN, {patch: true, permissions: 0755})

        let outfile = me.dir.rel.join(base).joinExt('deb', true)
        trace('Package', outfile)
        run(pmaker + ' --build ' + DEBIAN.dirname + ' ' + outfile, {filter: true})

        let sumline = checksum(outfile) + ' ' + outfile.basename + '\n'
        me.dir.rel.join('sha256-' + base).joinExt('deb.txt', true).write(sumline)
        sumline = md5sum(outfile) + ' ' + outfile.basename + '\n'
        me.dir.rel.join('md5-' + base).joinExt('deb.txt', true).write(sumline)

        /* This is done instead by the farm when posting the image */
        // run('dpkg-sig -k ' + KEY ' --sign builder ' + outfile)
    }

    function packageWindows(prefixes) {
        let search = me.dir.programFiles32.files('Inno Setup*').sort().reverse()
        let pmaker = Cmd.locate('iscc.exe', search)
        if (!pmaker) {
            throw 'Cannot locate Inno Setup'
        }
        let s = me.settings
        let wpak = me.dir.top.join('installs/' + me.platform.os)
        let media = prefixes.media

        copyFiles(me.dir.top.join('LICENSE.md'), media)
        let iss = media.join('install.iss')
        copyFiles(wpak.join('install.iss'), iss, {patch: true})

        let files = prefixes.root.files('**', {exclude: /\/$/, missing: undefined})

        let appPrefix = me.prefixes.app.removeDrive().portable
        let top = Path(prefixes.root.name + appPrefix)
        let cp: File = iss.open('atw')
        for each (file in files) {
            let src = file.relativeTo(media)
            let dest = file.relativeTo(top).windows
            cp.write('Source: "' + src + '"; DestDir: "{app}\\' + dest.dirname + '"; ' +
                'DestName: "' + dest.basename + '";\n')
        }
        cp.close()

        let data = iss.readString()
        if (me.platform.arch == 'x64') {
            sub = '{pf64}'
        } else {
            sub = '{pf32}'
        }
        data = data.replace(/{pf}/g, sub)
        iss.write(data)

        let base = [s.name, s.version, me.platform.dist, me.platform.os, me.platform.arch].join('-')
        let outfile = me.dir.rel.join(base).joinExt('exe', true)
        run([pmaker, iss], {filter: true})
        media.join('Output/setup.exe').copy(outfile)

        /* Sign */
        let cert = 'c:/crt/signing.pfx'
        if (Path(cert).exists) {
            let pass = Path('c:/crt/signing.pass').readString().trim()
            trace('Sign', outfile)
            let sign = Cmd.locate('signtool.exe', me.targets.compiler.search)
            trace('Run', [sign, 'sign', '/f', cert, '/p', pass, '/t', 
                'http://timestamp.verisign.com/scripts/timestamp.dll', outfile])
            Cmd.run([sign, 'sign', '/f', cert, '/p', pass, '/t', 
                'http://timestamp.verisign.com/scripts/timestamp.dll', outfile], {filter: true})
        }
        /* Wrap in a zip archive */
        let zipfile = outfile.joinExt('zip', true)
        zipfile.remove()
        run(['zip', '-q', zipfile.basename, outfile.basename], {dir: me.dir.rel, filter: true})

        let sumline = checksum(zipfile) + ' ' + zipfile.basename + '\n'
        me.dir.rel.join('sha256-' + base).joinExt('exe.zip.txt', true).write(sumline)
        sumline = md5sum(zipfile) + ' ' + zipfile.basename + '\n'
        me.dir.rel.join('md5-' + base).joinExt('exe.zip.txt', true).write(sumline)

        outfile.remove()
    }

    public function checkInstalled() {
        let result = []
        for each (key in ['app', 'vapp', 'etc', 'bin']) {
            let prefix = me.prefixes[key]
            if (!prefix.exists) {
                result.push(prefix)
            }
        }
        return result.length > 0 ? result.unique() : null
    }

    public function checkUninstalled() {
        let result = []
        for each (prefix in me.prefixes) {
            if (!prefix.name.contains(me.settings.name)) {
                continue
            }
            if (prefix.exists) {
                result.push(prefix)
            }
        }
        return result.length > 0 ? result.unique() : null
    }

    public function getWebUser(): String {
        if (me.platform.os == 'macosx') {
            return '_www'
        } else if (me.platform.os == 'windows') {
            return 'Administrator'
        } else if (me.platform.os == 'linux' || me.platform.os == 'freebsd') {
            return 'nobody'
        }
        return '0'
    }

    public function getWebGroup(): String {
        if (me.platform.os == 'macosx') {
            return '_www'
        } else if (me.platform.os == 'windows') {
            return 'Administrator'
        } else if (me.platform.os == 'linux' || me.platform.os == 'freebsd') {
            let groups = Path('/etc/group').readString()
            if (groups.contains('nogroup:')) {
                return 'nogroup'
            }
            return 'nobody'
        }
        return '0'
    }

    function skip(name, msg) {
        if (me.options.why) {
            trace('Skip', 'Manifest item "' + name + '", ' + msg)
        }
    }

    public function makeVersion(version: String): Number {
        let parts = version.trim().split(".")
        let patch = 0, minor = 0
        let major = parts[0] cast Number
        if (parts.length > 1) {
            minor = parts[1] cast Number
        }
        if (parts.length > 2) {
            patch = parts[2] cast Number
        }
        return (((major * VER_FACTOR) + minor) * VER_FACTOR) + patch
    }

    function checksum(filename) {
        return(Cmd.run('shasum -a 256 ' + filename).split(' ')[0])
    }

    function md5sum(filename: Path) {
        return md5(filename.readString())
    }

} /* InstallsInner class */
} /* embedthis.me */

/*
    @copy   default

    Copyright (c) Embedthis Software. All Rights Reserved.

    This software is distributed under commercial and open source licenses.
    You may use the Embedthis Open Source license or you may acquire a 
    commercial license from Embedthis Software. You agree to be fully bound
    by the terms of either license. Consult the LICENSE.md distributed with
    this software for full details and other copyrights.

    Local variables:
    tab-width: 4
    c-basic-offset: 4
    End:
    vim: sw=4 ts=4 expandtab

    @end
 */
