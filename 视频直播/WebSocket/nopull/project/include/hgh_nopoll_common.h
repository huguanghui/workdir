#ifndef __HGH_NOPOLL_COMMON_H__
#define __HGH_NOPOLL_COMMON_H__

#include <nopoll.h>
#include <pthread.h>

noPollPtr __nopoll_regtest_mutex_create(void);
void __nopoll_regtest_mutex_destroy(noPollPtr _mutex);
void __nopoll_regtest_mutex_lock(noPollPtr _mutex);
void __nopoll_regtest_mutex_unlock(noPollPtr _mutex);

#endif
