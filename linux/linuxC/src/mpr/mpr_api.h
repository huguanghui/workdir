#ifndef MPR_API_H
#define MPR_API_H 1

/********************************** Includes **********************************/

#include "me.h"
#include "osdep.h"

#ifdef __cplusplus
extern "C" {
#endif

/*********************************** Defines **********************************/

struct Mpr;

/************************************ Error Codes *****************************/

/*
    Standard errors
 */
#define MPR_ERR_OK                      0       /**< Success */
#define MPR_ERR_BASE                    -1      /**< Base error code */
#define MPR_ERR                         -1      /**< Default error code */
#define MPR_ERR_ABORTED                 -2      /**< Action aborted */
#define MPR_ERR_ALREADY_EXISTS          -3      /**< Item already exists */
#define MPR_ERR_BAD_ARGS                -4      /**< Bad arguments or paramaeters */
#define MPR_ERR_BAD_FORMAT              -5      /**< Bad input format */
#define MPR_ERR_BAD_HANDLE              -6      /**< Bad file handle */
#define MPR_ERR_BAD_STATE               -7      /**< Module is in a bad state */
#define MPR_ERR_BAD_SYNTAX              -8      /**< Input has bad syntax */
#define MPR_ERR_BAD_TYPE                -9      /**< Bad object type */
#define MPR_ERR_BAD_VALUE               -10     /**< Bad or unexpected value */
#define MPR_ERR_BUSY                    -11     /**< Resource is busy */
#define MPR_ERR_CANT_ACCESS             -12     /**< Cannot access the file or resource */
#define MPR_ERR_CANT_ALLOCATE           -13     /**< Cannot allocate resource */
#define MPR_ERR_CANT_COMPLETE           -14     /**< Operation cannot complete */
#define MPR_ERR_CANT_CONNECT            -15     /**< Cannot connect to network or resource */
#define MPR_ERR_CANT_CREATE             -16     /**< Cannot create the file or resource */
#define MPR_ERR_CANT_DELETE             -17     /**< Cannot delete the resource */
#define MPR_ERR_CANT_FIND               -18     /**< Cannot find resource */
#define MPR_ERR_CANT_INITIALIZE         -19     /**< Cannot initialize resource */
#define MPR_ERR_CANT_LOAD               -20     /**< Cannot load the resource */
#define MPR_ERR_CANT_OPEN               -21     /**< Cannot open the file or resource */
#define MPR_ERR_CANT_READ               -22     /**< Cannot read from the file or resource */
#define MPR_ERR_CANT_WRITE              -23     /**< Cannot write to the file or resource */
#define MPR_ERR_DELETED                 -24     /**< Resource has been deleted */
#define MPR_ERR_MEMORY                  -25     /**< Memory allocation error */
#define MPR_ERR_NETWORK                 -26     /**< Underlying network error */
#define MPR_ERR_NOT_INITIALIZED         -27     /**< Module or resource is not initialized */
#define MPR_ERR_NOT_READY               -28     /**< Resource is not ready */
#define MPR_ERR_READ_ONLY               -29     /**< The operation timed out */
#define MPR_ERR_TIMEOUT                 -30     /**< Operation exceeded specified time allowed */
#define MPR_ERR_TOO_MANY                -31     /**< Too many requests or resources */
#define MPR_ERR_WONT_FIT                -32     /**< Requested operation won't fit in available space */
#define MPR_ERR_WOULD_BLOCK             -33     /**< Blocking operation would block */
#define MPR_ERR_MAX                     -34

/*********************************** Thread Sync ******************************/

typedef struct MprSpin {
    #if USE_MPR_LOCK
        MprMutex                cs;
    #elif ME_WIN_LIKE
        CRITICAL_SECTION        cs;            /**< Internal mutex critical section */
        bool                    freed;         /**< Mutex has been destroyed */
    #elif VXWORKS
        SEM_ID                  cs;
    #elif ME_UNIX_LIKE
        #if ME_COMPILER_HAS_SPINLOCK
            pthread_spinlock_t  cs;
        #else
            pthread_mutex_t     cs;
        #endif
    #else
        #warning "Unsupported OS in MprSpin definition in mpr.h"
    #endif
#if ME_DEBUG
        MprOsThread             owner;
#endif
} MprSpin;

typedef struct Mpr {
    int argc;

} Mpr;

#define MPR_DISABLE_GC          0x1         /**< Disable GC */
#define MPR_USER_EVENTS_THREAD  0x2         /**< User will explicitly manage own mprServiceEvents calls */
#define MPR_NO_WINDOW           0x4         /**< Don't create a windows Window */
#define MPR_DELAY_GC_THREAD     0x8         /**< Delay starting the GC thread */
#define MPR_DAEMON              0x10        /**< Make the process a daemon */

PUBLIC Mpr *mprCreate(int argc, char **argv, int flags);

// PUBLIC int mprDaemon();

#ifdef __cplusplus
}
#endif
#endif  /* MPR_H */