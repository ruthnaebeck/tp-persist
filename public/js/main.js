$(function initializeMap () {

  const fullstackAcademy = new google.maps.LatLng(40.705086, -74.009151);

  const styleArr = [
    {
      featureType: 'landscape',
      stylers: [{ saturation: -100 }, { lightness: 60 }]
    },
    {
      featureType: 'road.local',
      stylers: [{ saturation: -100 }, { lightness: 40 }, { visibility: 'on' }]
    },
    {
      featureType: 'transit',
      stylers: [{ saturation: -100 }, { visibility: 'simplified' }]
    },
    {
      featureType: 'administrative.province',
      stylers: [{ visibility: 'off' }]
    },
    {
      featureType: 'water',
      stylers: [{ visibility: 'on' }, { lightness: 30 }]
    },
    {
      featureType: 'road.highway',
      elementType: 'geometry.fill',
      stylers: [{ color: '#ef8c25' }, { lightness: 40 }]
    },
    {
      featureType: 'road.highway',
      elementType: 'geometry.stroke',
      stylers: [{ visibility: 'off' }]
    },
    {
      featureType: 'poi.park',
      elementType: 'geometry.fill',
      stylers: [{ color: '#b6c54c' }, { lightness: 40 }, { saturation: -40 }]
    }
  ];

  const mapCanvas = document.getElementById('map-canvas');

  const currentMap = new google.maps.Map(mapCanvas, {
    center: fullstackAcademy,
    zoom: 13,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    styles: styleArr
  });

  // const iconURLs = {
  //   hotel: '/images/lodging_0star.png',
  //   restaurant: '/images/restaurant.png',
  //   activity: '/images/star-3.png'
  // };

  function drawMarker (type, coords) {
    // TODO: Pan map / recalculate viewport here maybe?
    const latLng = new google.maps.LatLng(coords[0], coords[1]);
    const marker = new google.maps.Marker({
      position: latLng
    });
    marker.setMap(currentMap);
    return marker;
  }

  // 0. Fetch the database, parsed from json to a js object
  const db = fetch('/api').then(r => r.json());

  // const db = fetch('/api')
  // .then(function(r){
  //   return r.json();
  // }).then(function(d){
  //   console.log(d);
  // });

  // TODO:
  // 1. Populate the <select>s with <option>s
  $('select').each(
    (_index, select) => {
      db.then(db =>
        $(select).append(
          db[select.dataset.type].map (
            item => Object.assign(
              $(`<option id=${item.id}>${item.name}</option>`)[0]
              , {
                item: item,
              })
          )
        )
      );
    });

  // 2. Wire up the add buttons
  // We could do this if we wanted to select by the add
  // dataset item instead:
  //
  //   $('button[data-action="add"]').click(
  // $('button.add').click(
  //   evt =>
  //     $(evt.target.dataset.from)
  //       .find('option:selected')
  //       .each((_i, option) => {
  //         const item = option.item
  //             , type = $(option)
  //                 .closest('select')[0]
  //                 .dataset.type;

  //         // Make a li out of this item
  //         const li = $(`<li>${item.name} <button class='del'>x</button></li>`)[0];

  //         // Draw a marker on the map and attach the marker to the li
  //         li.marker = drawMarker(type, item.place.location);

  //         // Add this item to our itinerary for the current day
  //         $('.current.day').append(li);
  //       })
  // );

  // 3. Wire up delete buttons
  $(document).on('click', 'button.del',
    evt => $(evt.target).closest('li').each((_i, li) => {
      li.marker.setMap(null);
      $(li).remove();
    })
  );


  function numberDays() {
    $('.day').each((index, day) =>
      $(day).find('.day-head').text(`day ${index + 1}`)
    );
  }

  // 5. Deal with switching days
  $(document).on('click', '.day-head',
    evt => {
      $('.day.current').removeClass('current');
      const $day = $(evt.target).closest('.day');

      $('li').each((_i, li) => li.marker && li.marker.setMap(null));
      $day.addClass('current');
      $day.find('li').each((_i, li) => li.marker.setMap(currentMap));
    }
  );



  // When we start, add a day
  // $('button.addDay').click();

  // Route for showing all days

  $.get('/api/days/all')
  .then(function(days){
    $('#days').append(days.map(function(day, idx){
      if(idx){
        return $('<ol class=day><h3><span class=day-head id=' + day.id + '>Day ' + day.number + '</span><button class=delDay>x</button></h3></ol>');
      }else{
        return $(`<ol class="day current"><h3><span class=day-head id=` + day.id + `>Day ` + day.number + `</span><button class=delDay>x</button></h3><li>${day.hotel.name}<button class='del'>x</button></li></ol>`);
      }
    })
    );
  });

  //add day button
  $('button.addDay').on('click', function(){
    $.post('/api/days/add')
    .then(function(day){
      $('.day.current').removeClass('current');
      $('#days').append(
        $('<ol class="day current"><h3><span class=day-head id=' + day.id + '>Day ' + day.number + '</span><button class=delDay>x</button></h3></ol>')
      );
    });
  });

  // Delete day button
  $(document).on('click', 'button.delDay', function(){
    var id = $(this).closest('.day').children().children('span').attr('id');
    $(this).closest('.day').remove();
    $.ajax('/api/days/' + id, {method: 'delete'})
    .then(function(){
      console.log('deleted');
    });
  });

  $('button[data-action="add-hotel"]').on('click', function(){
    var hotelId = $('#hotels').find('option:selected')
    .attr('id');
    var dayId = $('.day.current span').attr('id');
    var hotelName = $('#hotels').find('option:selected')
    .text();
    console.log(hotelName);
    $.post(`/api/days/${dayId}/hotels/${hotelId}`)
    .then(function(){
      $('.day.current').append($(`<li>${hotelName} <button class='del'>x</button></li>`));
    })
  })

    //   $('button[data-action="add"]').click(
  // $('button.add').click(
  //   evt =>
  //     $(evt.target.dataset.from)
  //       .find('option:selected')
  //       .each((_i, option) => {
  //         const item = option.item
  //             , type = $(option)
  //                 .closest('select')[0]
  //                 .dataset.type;

  //         // Make a li out of this item
  //         const li = $(`<li>${item.name} <button class='del'>x</button></li>`)[0];

  //         // Draw a marker on the map and attach the marker to the li
  //         li.marker = drawMarker(type, item.place.location);

  //         // Add this item to our itinerary for the current day
  //         $('.current.day').append(li);
  //       })
  // );


// end of document.ready
});

