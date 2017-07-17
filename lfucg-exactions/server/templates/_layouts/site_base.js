$( document ).ready(function() {
    
    $(document).click(function (e)
    {
        var container = $(".navbar-drop-background");

        if (!container.is(e.target) // if the target of the click isn't the container...
            && container.has(e.target).length === 0) // ... nor a descendant of the container
        {
            $('#navbar-header-collapse').collapse('hide');
        }
    });

});