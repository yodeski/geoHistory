
var resumeApp = angular.module('resumeApp', ['duScroll'])
    .directive('anchorScrollYOffset', anchorScrollYOffsetDirective);

var map = null;
var view = null;
var measureTooltipElement;
var measureTooltip;

resumeApp.run(['$rootScope', function ($rootScope) {
    $rootScope.$on('$routeChangeStart', function (e, next, current) {
        console.log('Se comenzará a cambiar la ruta hacia' + next.originalPath);
    })
}]);

function anchorScrollYOffsetDirective($anchorScroll) {
    // DDO
    return {
        restrict: 'A',
        link: anchorScrollYOffsetPostLink
    };

    // Functions - Definitions
    function anchorScrollYOffsetPostLink(scope, elem) {
        $anchorScroll.yOffset = elem;
    }
}


resumeApp.controller('CtrlResume', function ($scope, $http, $sce, $location, $document) {
    $scope.sections = [];
    map = getMap();

    $http.get('api/history/yodeski/resume').then(function (response) {
        var sections = response.data;
        $scope.classLayout = sections[0].classLayout;
        $scope.currSectionid = sections[0].sectionId;
        $scope.currPlaceid = sections[0].places[0].placeId;
        $scope.lastSectionid = sections[sections.length - 1].sectionId;
        var converter = new showdown.Converter();
        for (var i = 0; i < sections.length; i++) {
            sections[i].sectionImage = $sce.trustAsHtml(converter.makeHtml(sections[i].sectionImage));
            sections[i].sectionText = $sce.trustAsHtml(converter.makeHtml(sections[i].sectionText));
            if (sections[i].places) {
                for (var j = 0; j < sections[i].places.length; j++) {
                    sections[i].places[j].placeText = $sce.trustAsHtml(converter.makeHtml(sections[i].places[j].placeText));
                }
            }
        };
        $scope.sections = sections;
        view = getView(ol.proj.fromLonLat([0, -0]), 2);
        //view = getView(ol.proj.fromLonLat([sections[0].places[0].lat, sections[0].places[0].lon]), sections[0].places[0].zoom);
        angular.element(document.getElementsByClassName('ol-viewport'))[0].style['height'] = 0;
        map = getMap(view);

        setTimeout(function () {
            var locations = [{
                'coords': ol.proj.fromLonLat([sections[0].places[0].lat, sections[0].places[0].lon]),
                'tooltip': sections[0].places[0].placeName,
                'zoom': sections[0].places[0].zoom
            }];
            tour(locations);
            map.updateSize()
        }, 10);

    });

    $scope.doUp = function (sectionid, currPlaceid) {
        if ($scope.currSectionid > 1) {
            $scope.currSectionid = sectionid - 1;

            var oldSectionid = sectionid;
            var curSectionid = $scope.currSectionid;

            var oldPlaceElement = $('.place#{0}'.format(oldSectionid));
            var nextPlaceElement = $('.place#{0}'.format(curSectionid));

            var sectToHide = $('#sect{0}'.format(oldSectionid));
            sectToHide.addClass('hide');

            var sectToShow = $('#sect{0}'.format(curSectionid));
            sectToShow.removeClass('active');
            sectToShow.addClass('active');

            $document.scrollToElement(sectToShow[0], 0, 500);

            var places = sectToShow.find('.place');
            var locations = [];
            for (var i = 0; i < places.length; i++) {
                var p = $(places[i]);
                var lat = parseFloat(p.attr('data-lat'));
                var lon = parseFloat(p.attr('data-lon'));
                var zoom = p.attr('data-zoom');
                var tooltip = p.attr('data-placename');
                locations.push({ 'coords': ol.proj.fromLonLat([lat, lon]), 'tooltip': tooltip, 'zoom': zoom });
            }
            tour(locations);
        }
    };

    $scope.doDown = function (sectionid) {
        if ($scope.currSectionid < $scope.lastSectionid) {
            $scope.currSectionid = sectionid + 1;

            var oldSectionid = sectionid;
            var curSectionid = $scope.currSectionid;

            var oldPlaceElement = $('#sect{0}'.format(oldSectionid));
            var nextPlaceElement = $('#sect{0}'.format(curSectionid));

            var sectToHide = $('#sect{0}'.format(oldSectionid));
            sectToHide.addClass('hide');
            sectToHide.removeClass('active');

            var sectToShow = $('#sect{0}'.format(curSectionid));
            sectToShow.removeClass('hide');
            sectToShow.addClass('active');

            $document.scrollToElement(sectToShow[0], 0, 500);

            var places = sectToShow.find('.place');
            var locations = [];
            for (var i = 0; i < places.length; i++) {
                var p = $(places[i]);
                var lat = parseFloat(p.attr('data-lat'));
                var lon = parseFloat(p.attr('data-lon'));
                var zoom = p.attr('data-zoom');
                var tooltip = p.attr('data-placename');
                locations.push({ 'coords': ol.proj.fromLonLat([lat, lon]), 'tooltip': tooltip, 'zoom': zoom });
            }
            tour(locations);
        }
    };



});


/*
* String format
*/
String.prototype.format = function () {
    var formatted = this;
    for (var i = 0; i < arguments.length; i++) {
        var regexp = new RegExp('\\{' + i + '\\}', 'gi');
        formatted = formatted.replace(regexp, arguments[i]);
    }
    return formatted;
};

function getView(lnpLocation, lnpZoom) {
    return new ol.View({
        center: lnpLocation,
        zoom: lnpZoom
    });
}

function getMap(lnpView) {
    var rasterLayer = new ol.layer.Tile({
        source: new ol.source.TileJSON({
            url: 'https://api.tiles.mapbox.com/v3/mapbox.geography-class.json?secure',
            crossOrigin: ''
        })
    });

    var map = new ol.Map({
        target: 'map',
        layers: [rasterLayer],
        // Improve user experience by loading tiles while animating. Will make
        // animations stutter on mobile or slow devices.
        loadTilesWhileAnimating: true,
        view: lnpView
    });

    return map;
}

function flyTo(location, zoomOut, done) {
    var duration = 6000;
    //var zoom = view.getZoom();
    var parts = 2;
    var called = false;

    createMeasureTooltip();
    measureTooltipElement.innerHTML = location.tooltip;
    measureTooltip.setPosition(location.coords);

    function callback(complete) {
        --parts;
        if (called) {
            return;
        }
        if (parts === 0 || !complete) {
            called = true;
            done(complete);
        }
    }
    view.animate({
        center: location.coords,
        duration: duration
    }, callback);
    view.animate({
        zoom: zoomOut,
        duration: duration / 2
    }, {
            zoom: location.zoom,
            duration: duration / 2
        }, callback);
}

function tour(locations) {
    var index = -1;
    function next(more) {
        if (more) {
            ++index;
            if (index < locations.length) {
                var delay = index === 0 ? 0 : 1000;
                setTimeout(function () {
                    var zoomOut = 4;
                    if (locations[index - 1])
                        zoomOut = getDistance(locations[index].coords, locations[index - 1].coords) >= 500 ? 4 : 10;
                    flyTo(locations[index], zoomOut, next);
                }, delay);
            } else {
                //alert('Tour complete');
            }
        } else {
            //alert('Tour cancelled');
        }
    }
    next(true);
}

function getDistance(location1, location2) {
    var wgs84Sphere = new ol.Sphere(6378137);
    var sourceProj = map.getView().getProjection();
    var c1 = ol.proj.transform(location1, sourceProj, 'EPSG:4326');
    var c2 = ol.proj.transform(location2, sourceProj, 'EPSG:4326');

    var length = wgs84Sphere.haversineDistance(c1, c2);
    return Math.round(length / 1000 * 100) / 100;
}

/**
* Creates a new measure tooltip
*/
function createMeasureTooltip() {
    if (measureTooltipElement) {
        measureTooltipElement.parentNode.removeChild(measureTooltipElement);
    }
    measureTooltipElement = document.createElement('div');
    measureTooltipElement.className = 'tooltip tooltip-static';
    measureTooltip = new ol.Overlay({
        element: measureTooltipElement,
        offset: [0, -15],
        positioning: 'bottom-center'
    });
    map.addOverlay(measureTooltip);
}