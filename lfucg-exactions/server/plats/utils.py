def created_by_modified_by(self, **kwargs):
    request = self.context.get('request', None)

    if request is not None:
        self.validated_data['modified_by'] = request.user

        if self.instance is None:
            self.validated_data['created_by'] = request.user

    super(self.__class__, self).save(**kwargs)
