export default function parallax() {
    (function() {
        // Event listener added to the document to listen for mouse movement
        document.addEventListener("mousemove", parallax);

        // Selecting the DOM element with the class "image-background"
        const elem = document.querySelector(".image-background");

        // Function to handle parallax effect based on mouse movement
        function parallax(e) {

            // Getting the half width and height of the window
            let _w = window.innerWidth / 2;
            let _h = window.innerHeight / 2;

            // Capturing mouse coordinates
            let _mouseX = e.clientX;
            let _mouseY = e.clientY;

            // Calculating depth values for parallax effect
            let _depth1 = `${20 - (_mouseX - _w) * 0.01}% ${50 - (_mouseY - _h) * 0.01}%`;
            let _depth2 = `${50 - (_mouseX - _w) * 0.02}% ${50 - (_mouseY - _h) * 0.02}%`;
            let _depth3 = `${50 - (_mouseX - _w) * 0.06}% ${50 - (_mouseY - _h) * 0.06}%`;

            // Constructing the background position value
            let x = `${_depth3}, ${_depth2}, ${_depth1}`;

            // Applying the background position to the element
            elem.style.backgroundPosition = x;
        }
    })();
}