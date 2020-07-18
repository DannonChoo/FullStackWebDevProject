let darkMode = localStorage.getItem("dark");
const darkModeToggle = document.querySelector('.theme-toggle-button');

const enableDarkMode = () => {
    document.body.classList.add('dark');
    localStorage.setItem("dark", "enabled");
    $('#table').addClass(' table-dark');
    $('.change').removeClass(' btn-light');
    $('.change').addClass(' btn-secondary');
}

const enableLightMode = () => {
    document.body.classList.remove('dark');
    localStorage.setItem("dark", null);
    $('#table').removeClass(' table-dark');
    $('.change').removeClass(' btn-secondary');
    $('.change').addClass(' btn-light');
}

if (darkMode == "enabled") {
    enableDarkMode();
}

darkModeToggle.addEventListener("click", () => {
    darkMode = localStorage.getItem("dark");
    if (darkMode != "enabled") {
        enableDarkMode();
        console.log(darkMode);
    } else {
        enableLightMode();
        console.log(darkMode);
    }
});