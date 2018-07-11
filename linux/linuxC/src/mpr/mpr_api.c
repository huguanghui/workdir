#include "mpr_api.h"

PUBLIC Mpr *mprCreate(int argc, char **argv, int flags)
{
    Mpr     *mpr;

    srand((uint) time(NULL));

    if (flags & MPR_DAEMON) {
        printf("MPR_DAEMON！\n");
    }

    return mpr;
}

// PUBLIC int mprDaemon()
// {
// #if ME_UNIX_LIKE
//     struct sigaction    act, old;
//     int                 i, pid, status;

//     /*
//         Ignore child death signals
//      */
//     memset(&act, 0, sizeof(act));
//     act.sa_sigaction = (void (*)(int, siginfo_t*, void*)) SIG_DFL;
//     sigemptyset(&act.sa_mask);
//     act.sa_flags = SA_NOCLDSTOP | SA_RESTART | SA_SIGINFO;

//     if (sigaction(SIGCHLD, &act, &old) < 0) {
//         fprintf(stderr, "Cannot initialize signals");
//         return MPR_ERR_BAD_STATE;
//     }
//     /*
//         Close stdio so shells won't hang
//      */
//     for (i = 0; i < 3; i++) {
//         close(i);
//     }
//     /*
//         Fork twice to get a free child with no parent
//      */
//     if ((pid = fork()) < 0) {
//         fprintf(stderr, "Fork failed for background operation");
//         return MPR_ERR;

//     } else if (pid == 0) {
//         /* Child of first fork */
//         if ((pid = fork()) < 0) {
//             fprintf(stderr, "Second fork failed");
//             exit(127);

//         } else if (pid > 0) {
//             /* Parent of second child -- must exit. This is waited for below */
//             exit(0);
//         }

//         /*
//             This is the real child that will continue as a daemon
//          */
//         setsid();
//         if (sigaction(SIGCHLD, &old, 0) < 0) {
//             fprintf(stderr, "Cannot restore signals");
//             return MPR_ERR_BAD_STATE;
//         }
//         return 0;
//     }

//     /*
//         Original (parent) process waits for first child here. Must get child death notification with a successful exit status.
//      */
//     while (waitpid(pid, &status, 0) != pid) {
//         if (errno == EINTR) {
//             mprSleep(100);
//             continue;
//         }
//         fprintf(stderr, "Cannot wait for daemon parent.");
//         exit(0);
//     }
//     if (WEXITSTATUS(status) != 0) {
//         fprintf(stderr, "Daemon parent had bad exit status.");
//         exit(0);
//     }
//     if (sigaction(SIGCHLD, &old, 0) < 0) {
//         fprintf(stderr, "Cannot restore signals");
//         return MPR_ERR_BAD_STATE;
//     }
//     exit(0);
// #else
//     return 0;
// #endif   
// }


/***** atomic *****/

/*********************************** Includes *********************************/




/*********************************** Local ************************************/

static MprSpin  atomicSpinLock;
static MprSpin  *atomicSpin = &atomicSpinLock;

/************************************ Code ************************************/