System.import('single-spa').then(function (singleSpa) {
    singleSpa.registerApplication(
        'content1', function () {
            return System.import('content1')
        },
        function (location) {
            return location.pathname.startsWith('/content1')
        }
        );

    singleSpa.registerApplication(
        'content2',
        function () {
            return System.import('/content2')
        },
        function (location) {
            return location.pathname.startsWith('/content2')
        });
});

