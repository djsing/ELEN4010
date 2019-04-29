'user strict'

document.addEventListener('DOMContentLoaded', function () {
  let lang
  if (document.querySelectorAll('#map').length > 0) {
    if (document.querySelector('html').lang) {
      lang = document.querySelector('html').lang
    } else {
      lang = 'en'
    }

    let jsFile = document.createElement('script')
    jsFile.type = 'text/javascript'
    jsFile.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyCgnuMPrM3Yha6Y9K6f_XkdifRrE2t33Z4&libraries=places&callback=initMap&language=' + lang
    document.getElementsByTagName('head')[0].appendChild(jsFile)
  }
})