document.addEventListener('DOMContentLoaded', function () {
    // Function to show the modal
    function showModal() {
        var modal = document.getElementById('myModal');
        modal.style.display = 'block';
    }

    // Function to check user inactivity and show the modal after 20 minutes
    function checkInactivity() {
        var inactivityTimeout = 20 * 60 * 1000; // 20 minutes in milliseconds

        var timeoutId;

        function resetTimer() {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(showModal, inactivityTimeout);
        }

        document.addEventListener('mousemove', resetTimer);
        document.addEventListener('keydown', resetTimer);
        document.addEventListener('scroll', resetTimer);

        resetTimer();
    }

    // Close the modal when the close button is clicked
    var closeModalBtn = document.getElementById('closeModalBtn');
    closeModalBtn.onclick = function () {
        var modal = document.getElementById('myModal');
        modal.style.display = 'none';
    };

    // Close the modal when the user clicks outside of it
    window.onclick = function (event) {
        var modal = document.getElementById('myModal');
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    };

    // Close the modal when "Not Now" button is clicked
    var notNowBtn = document.getElementById('notNowBtn');
    notNowBtn.onclick = function () {
        var modal = document.getElementById('myModal');
        modal.style.display = 'none';
    };

    // Start checking for inactivity and show the modal after 20 minutes
    checkInactivity();
});
