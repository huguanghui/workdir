static char* ngx_test(ngx_conf_t* cf, ngx_command_t* cmd, void* conf);

static ngx_command_t ngx_test_commonds[] =
{
	{
		ngx_string("mp4"),
		ngx_string("ism"),
		NGX_HTTP_LOC_CONF|NGX_CONF_NOARGS,
		ngx_test,
		0,
		0,
		NULL
	},
	ngx_null_command
};


static ngx_http_module_t ngx_test_module_ctx = 
{
	NULL,
	NULL,

	NULL,
	NULL,

	NULL,
	NULL,

	NULL,
	NULL
};

ngx_module_t ngx_test_module = 
{
	NGX_MODULE_V1,
	&ngx_test_module_ctx,
	NGX_HTTP_MODULE,
	NULL,
	NULL,
	NULL,
	NULL,
	NULL,
	NULL,
	NULL,
	NGX_MODULE_V1_PADDING
};

static ngx_int_t ngx_test_handler(ngx_http_request_t* r)
{

	return ngx_http_output_filter(r, out);
}

static char* ngx_test(ngx_conf_t* cf, ngx_command_t* cmd, void* conf)
{
	ngx_http_core_loc_conf_t* clcf = 
	  ngx_http_conf_get_module_loc_conf(cf, ngx_http_core_module);

	clcf->handler = ngx_test_handler;

	return NGX_CONF_OK;
}