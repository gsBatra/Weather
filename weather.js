$(document).ready(function() { 
    $('#submitZipCode').click(function(){
        const zipcode = $('#zipcode').val();
        $("#current").css("visibility", "visible");
        $("#forecast").css("visibility", "visible");
        $('#zipcode').val('');
        var lat;
        var lon;
        
        // Get Lat/Lon
        $.ajax({
            url: 'http://api.openweathermap.org/geo/1.0/zip?zip=' + zipcode + '&appid=1a026fe1a63ccf159ad52dfa0533357c',
            type: "GET",
            datatype: "jsonp",
            crossDomain: true,  // NEED THIS FOR CORS ISSUES
            success: function (response) {
                lat = response.lat;
                lon = response.lon;
                forecast();
            }
        })

        // Get current weather
        $.ajax({
            url: 'https://api.openweathermap.org/data/2.5/weather?zip=' + zipcode + '&units=imperial&appid=1a026fe1a63ccf159ad52dfa0533357c',
            type: "GET",
            datatype: "jsonp",
            crossDomain: true,  // NEED THIS FOR CORS ISSUES
            success: function (response) {
                // change icon
                let iconid = response.weather[0].icon;
                let iconsrc = "http://openweathermap.org/img/wn/" + iconid + "@2x.png";
                $("#card_img").attr("src", iconsrc);
                
                // header
                let description = response.weather[0].description.replace(/(^\w{1})|(\s{1}\w{1})/g, match => match.toUpperCase());
                $("#card_header").html(description + " in " + response.name + ", " + zipcode);

                // current and feels like temp / wind
                $("#card_current_temp").html("Current Temperature: " + response.main.temp + "°F");
                $("#card_feels_temp").html("Feels Like: " + response.main.feels_like + "°F");
                $("#card_wind").html("Wind Speed: " + response.wind.speed + " MPH");
            }
        })

        // Get forecast weather
        function forecast() {
            $.ajax({
                url: 'https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon + 
                    '&exclude=current,minutely,hourly,alerts&units=imperial&appid=1a026fe1a63ccf159ad52dfa0533357c',
                type: "GET",
                datatype: "jsonp",
                crossDomain: true,  // NEED THIS FOR CORS ISSUES
                success: function (response) {
                    const days = {"Mon":"Monday","Tue":"Tuesday","Wed":"Wednesday","Thu":"Thursday","Fri":"Friday","Sat":"Saturday","Sun":"Sunday"};
                    for(let i = 1; i <= 5; i++){
                        let card = new Date(response.daily[i-1].dt * 1000);
                        let day = card.toString().substring(0,3);
                        $("#card" + i + "_header").html(response.daily[i-1].weather[0].main + " on " + days[day]);
                        let iconid = response.daily[i-1].weather[0].icon;
                        let iconsrc = "http://openweathermap.org/img/wn/" + iconid + "@2x.png";
                        $("#card" + i + "_img").attr("src", iconsrc);
                        $("#card" + i + "_day_temp").html("Day Temperature: " + response.daily[i-1].temp.day + "°F");
                        $("#card" + i + "_minmax_temp").html("Max: " + response.daily[i-1].temp.max + "°F, Min: " + response.daily[i-1].temp.min + "°F");
                        $("#card" + i + "_wind").html("Wind Speed: " + response.daily[i-1].wind_speed + " MPH");
                    }
                }
            })
        }
        return false;
    })
});