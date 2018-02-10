#include "hgh_nopoll_app.h"

noPollCtx *ctx = NULL;

int main(int argc, char **argv)
{
	noPollConn *listener;
	int iterator;

	printf("INFO: install default threading functions to check noPoll locking code..\n");
	nopoll_thread_handlers(__nopoll_regtest_mutex_create, 
		__nopoll_regtest_mutex_destroy,
		__nopoll_regtest_mutex_lock,
		__nopoll_regtest_mutex_unlock);

	/* create the context */
	ctx = nopoll_ctx_new();

	iterator = 1;
	while (iterator < argc)
	{
		
	}

	nopoll_ctx_unref(ctx);

	nopoll_cleanup_library();

	return 0;
}