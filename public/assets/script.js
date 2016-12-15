jQuery(document).ready(function ($) {

  $(".scroll").click(function (event) {
    event.preventDefault();
    $('html,body').animate({scrollTop: $(this.hash).offset().top}, 400, 'swing');
  });


  var wow = new WOW(
    {
      boxClass: 'wowload',      // animated element css class (default is wow)
      animateClass: 'animated', // animation css class (default is animated)
      offset: 0,          // distance to the element when triggering the animation (default is 0)
      mobile: true,       // trigger animations on mobile devices (default is true)
      live: true        // act on asynchronously loaded content (default is true)
    }
  );
  // wow.init();


  $('.carousel').swipe({
    swipeLeft: function () {
      $(this).carousel('next');
    },
    swipeRight: function () {
      $(this).carousel('prev');
    },
    allowPageScroll: 'vertical'
  });


});

if ($("#map").length > 0) {
// map
  google.maps.event.addDomListener(window, 'load', init);
  var map;
  function init() {
    var mapOptions = {
      center: new google.maps.LatLng(44.4431941, 26.1224247),
      zoom: 18,
      zoomControl: true,
      zoomControlOptions: {
        style: google.maps.ZoomControlStyle.DEFAULT,
      },
      disableDoubleClickZoom: true,
      mapTypeControl: true,
      mapTypeControlOptions: {
        style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
      },
      scaleControl: true,
      scrollwheel: false,
      panControl: true,
      streetViewControl: true,
      draggable: true,
      overviewMapControl: true,
      overviewMapControlOptions: {
        opened: false,
      },
      mapTypeId: google.maps.MapTypeId.ROADMAP,
    };
    var mapElement = document.getElementById('map');
    var map = new google.maps.Map(mapElement, mapOptions);
    var locations = [
      ['All4MTB Shop', 'Strada Călușei 49, Bucharest, Romania', '075504450', 'contact@all4mtb.ro', 'http://www.all4mtb.ro', 44.4433341, 26.1237753, 'https://mapbuildr.com/assets/img/markers/solid-pin-blue.png']
    ];
    for (i = 0; i < locations.length; i++) {
      if (locations[i][1] == 'undefined') {
        description = '';
      } else {
        description = locations[i][1];
      }
      if (locations[i][2] == 'undefined') {
        telephone = '';
      } else {
        telephone = locations[i][2];
      }
      if (locations[i][3] == 'undefined') {
        email = '';
      } else {
        email = locations[i][3];
      }
      if (locations[i][4] == 'undefined') {
        web = '';
      } else {
        web = locations[i][4];
      }
      if (locations[i][7] == 'undefined') {
        markericon = '';
      } else {
        markericon = locations[i][7];
      }
      marker = new google.maps.Marker({
        icon: markericon,
        position: new google.maps.LatLng(locations[i][5], locations[i][6]),
        map: map,
        title: locations[i][0],
        desc: description,
        tel: telephone,
        email: email,
        web: web
      });
      if (web.substring(0, 7) != "http://") {
        link = "http://" + web;
      } else {
        link = web;
      }
      bindInfoWindow(marker, map, locations[i][0], description, telephone, email, web, link);
    }
    function bindInfoWindow(marker, map, title, desc, telephone, email, web, link) {
      var infoWindowVisible = (function () {
        var currentlyVisible = false;
        return function (visible) {
          if (visible !== undefined) {
            currentlyVisible = visible;
          }
          return currentlyVisible;
        };
      }());
      iw = new google.maps.InfoWindow();
      google.maps.event.addListener(marker, 'click', function () {
        if (infoWindowVisible()) {
          iw.close();
          infoWindowVisible(false);
        } else {
          var html = "<div style='color:#000;background-color:#fff;padding:5px;width:250px;'><h4>" + title + "</h4><p>" + desc + "<p><p>" + telephone + "<p><a href='mailto:" + email + "' >" + email + "<a><br><a href='" + link + "'' >" + web + "<a></div>";
          iw = new google.maps.InfoWindow({content: html});
          iw.open(map, marker);
          infoWindowVisible(true);
        }
      });
      google.maps.event.addListener(iw, 'closeclick', function () {
        infoWindowVisible(false);
      });
    }
  }
}
