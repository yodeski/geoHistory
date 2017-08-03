angular.
    module('resumeApp').
    component('resumeList', {
        template:
        '<section ng-repeat="section in $ctrl.sections">' +
            '<div ng-bind-html-unsafe="section.sectionimage"></div>' +
            '<div ng-bind-html-unsafe="section.sectiontext"></div>' +
            '<div class="place" ng-repeat="place in section.places"' +
                ' id="{{place.placeid}}"' +
                ' data-lat={{place.lat}}' +
                ' data-lon={{place.lon}}' +
                ' data-zoom={{place.zoom}}' +
                ' data-bearing={{place.bearing}}' +
                ' data-pitch={{place.pitch}}>' +
                '<div ng-bind-html-unsafe="place.placetext"></div>' +
            '</div>' +
        '</section>',
        controller: ['$http',
            function PhoneListController($http, $sce) {
                var self = this;
                $http.get('history/yodeski/resume').then(function (response) {
                    self.sections = response;
                    for (var i=0; i< self.sections.length; i++) {
                        self.sections[i].sectionimage= $sce.trustAsHtml(self.sections[i].sectionimage);
                        self.sections[i].sectiontext= $sce.trustAsHtml(self.sections[i].sectiontext);
                    };
                });

                this.phones = [
                    {
                        name: 'Nexus S',
                        snippet: 'Fast just got faster with Nexus S.'
                    }, {
                        name: 'Motorola XOOM™ with Wi-Fi',
                        snippet: 'The Next, Next Generation tablet.'
                    }, {
                        name: 'MOTOROLA XOOM™',
                        snippet: 'The Next, Next Generation tablet.'
                    }
                ];
            }
        ]
    });