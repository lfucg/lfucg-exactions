import logging
import traceback

logger = logging.getLogger(__name__)

class Log500ErrorsMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        return response

    def process_exception(self, request, ex):
        headers = {k: v for k, v in request.META.items() if k.startswith('HTTP_')}
        tb = ''.join(traceback.TracebackException.from_exception(ex).format())
        logger.error(ex, exc_info=1, extra={
            'log_source': 'middleware',
            'path': request.path,
            'method': request.method,
            'user': request.user.email if request.user else None,
            'view': request.resolver_match.view_name,
            'query_string': request.GET.urlencode(),
            "request_headers": headers,
            'request_body': request.body,
            'request_id': request.META.get('HTTP_X_REQUEST_ID'),
            'stack_trace': tb,
        })
        return None

