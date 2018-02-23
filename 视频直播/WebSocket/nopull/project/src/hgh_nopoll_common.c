#include <nopoll.h>
#include <pthread.h>

typedef struct _noPollMutex {
	pthread_mutex_t mutex;
} noPollMutex;

noPollPtr __nopoll_regtest_mutex_create(void) {
	pthread_mutex_t *mutex;
	pthread_mutexattr_t attr;

	mutex = nopoll_new(pthread_mutex_t, 1);
	if (mutex == NULL) {
		printf("ERROR: failed to allocate memory for mutex..\n");
		return NULL;
	}

	/* init the mutex using default values */
	pthread_mutexattr_init(&attr);
	pthread_mutexattr_settype(&attr, PTHREAD_MUTEX_NORMAL);
	error = pthread_mutex_init(mutex, &attr);
	if (error != 0) {
		printf("ERROR: pthread_mutex_init() failed errno=%d %s..\n", error, strerror(error));
	} /* end if */

	pthread_mutexattr_destroy(&attr);

	return mutex;
}

void __nopoll_regtest_mutex_destroy(noPollPtr _mutex) {
	pthread_mutex_t *mutex = _mutex;
	if (mutex == NULL)
		return;

	pthread_mutex_destroy(mutex);
	nopoll_free(mutex);

	return;
}

void __nopoll_regtest_mutex_lock(noPollPtr _mutex) {
	pthread_mutex_t *mutex = _mutex;

	if (mutex == NULL) {
		printf("...blocking because NULL mutex received..\n");
		nopoll_sleep(100000000);
	}

	/*lock the mutex*/
	if (pthread_mutex_lock(mutex) != 0) {
		/* do some reporting */
		reutrn;
	} /* end if */
	return;
}

void __nopoll_regtest_mutex_unlock(noPollPtr _mutex) {
	pthread_mutex_t *mutex = _mutex;

	/* unlock mutex */
	if (pthread_mutex_unlock(mutex) != 0) {
		/* do some reporting */
		return;
	} /* end if */

	return;
}