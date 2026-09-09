let data = null;
let language = "en";

const bibhagSelect = document.getElementById("bibhag");
const jelaSelect = document.getElementById("jela");
const upazilaSelect = document.getElementById("upazila");

const translations = {
    en: {
        title: "Bangladesh Social Benefit Watch",
        explore: "Explore Bangladesh",
        bibhag: "Bibhag",
        jela: "Jela",
        upazila: "Upazila",
        selectBibhag: "Select a bibhag",
        selectJela: "Select a jela",
        selectUpazila: "Select an upazila",
        graphs: "Graphs",
        information: "Information",
        empty: "No information has been added yet."
    },

    bn: {
        title: "বাংলাদেশ সামাজিক সুবিধা পর্যবেক্ষণ",
        explore: "বাংলাদেশ অন্বেষণ করুন",
        bibhag: "বিভাগ",
        jela: "জেলা",
        upazila: "উপজেলা",
        selectBibhag: "একটি বিভাগ নির্বাচন করুন",
        selectJela: "একটি জেলা নির্বাচন করুন",
        selectUpazila: "একটি উপজেলা নির্বাচন করুন",
        graphs: "গ্রাফ",
        information: "তথ্য",
        empty: "এখনও কোনো তথ্য যোগ করা হয়নি।"
    }
};


/* -----------------------------
   LOAD BANGLADESH DATA
----------------------------- */

fetch("data/bangladesh.json")
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        return response.json();
    })
    .then(json => {
        data = json;

        console.log("Bangladesh data loaded:", data);

        initializeSelectors();
    })
    .catch(error => {
        console.error("Could not load Bangladesh data:", error);
    });


/* -----------------------------
   INITIALIZE
----------------------------- */

function initializeSelectors() {
    loadBibhags();

    jelaSelect.disabled = true;
    upazilaSelect.disabled = true;

    addOption(
        jelaSelect,
        "",
        translations[language].selectJela
    );

    addOption(
        upazilaSelect,
        "",
        translations[language].selectUpazila
    );
}


/* -----------------------------
   LOAD DIVISIONS
----------------------------- */

function loadBibhags() {
    bibhagSelect.innerHTML = "";

    addOption(
        bibhagSelect,
        "",
        translations[language].selectBibhag
    );

    data.divisions.forEach((division, index) => {
        addOption(
            bibhagSelect,
            index,
            division[language]
        );
    });
}


/* -----------------------------
   DIVISION CHANGE
----------------------------- */

bibhagSelect.addEventListener("change", function () {

    const divisionIndex = this.value;

    jelaSelect.innerHTML = "";
    upazilaSelect.innerHTML = "";

    addOption(
        jelaSelect,
        "",
        translations[language].selectJela
    );

    addOption(
        upazilaSelect,
        "",
        translations[language].selectUpazila
    );

    upazilaSelect.disabled = true;

    if (divisionIndex === "") {
        jelaSelect.disabled = true;
        return;
    }

    const division = data.divisions[divisionIndex];

    if (!division) {
        jelaSelect.disabled = true;
        return;
    }

    jelaSelect.disabled = false;

    division.districts.forEach((district, index) => {
        addOption(
            jelaSelect,
            index,
            district[language]
        );
    });
});


/* -----------------------------
   DISTRICT CHANGE
----------------------------- */

jelaSelect.addEventListener("change", function () {

    const divisionIndex = bibhagSelect.value;
    const districtIndex = this.value;

    upazilaSelect.innerHTML = "";

    addOption(
        upazilaSelect,
        "",
        translations[language].selectUpazila
    );

    if (
        divisionIndex === "" ||
        districtIndex === ""
    ) {
        upazilaSelect.disabled = true;
        return;
    }

    const division = data.divisions[divisionIndex];
    const district = division.districts[districtIndex];

    if (!district) {
        upazilaSelect.disabled = true;
        return;
    }

    upazilaSelect.disabled = false;

    district.upazilas.forEach((upazila, index) => {
        addOption(
            upazilaSelect,
            index,
            upazila[language]
        );
    });
});


/* -----------------------------
   UPSZILA CHANGE
----------------------------- */

upazilaSelect.addEventListener("change", function () {

    if (this.value === "") {
        return;
    }

    const division = data.divisions[bibhagSelect.value];
    const district = division.districts[jelaSelect.value];
    const upazila = district.upazilas[this.value];

    console.log("Selected location:", {
        bibhag: division[language],
        jela: district[language],
        upazila: upazila[language]
    });

    // This is where your graphs/information
    // can later be updated for the selected upazila.
});


/* -----------------------------
   ADD OPTION
----------------------------- */

function addOption(select, value, text) {

    const option = document.createElement("option");

    option.value = value;
    option.textContent = text;

    select.appendChild(option);
}


/* -----------------------------
   LANGUAGE BUTTONS
----------------------------- */

document
    .getElementById("english")
    .addEventListener("click", () => {
        changeLanguage("en");
    });

document
    .getElementById("bangla")
    .addEventListener("click", () => {
        changeLanguage("bn");
    });


/* -----------------------------
   CHANGE LANGUAGE
----------------------------- */

function changeLanguage(newLanguage) {

    language = newLanguage;

    const t = translations[language];

    document.documentElement.lang = language;

    document.getElementById("site-title").textContent = t.title;
    document.getElementById("explore-title").textContent = t.explore;
    document.getElementById("bibhag-label").textContent = t.bibhag;
    document.getElementById("jela-label").textContent = t.jela;
    document.getElementById("upazila-label").textContent = t.upazila;
    document.getElementById("graphs-title").textContent = t.graphs;
    document.getElementById("information-title").textContent = t.information;
    document.getElementById("graphs-message").textContent = t.empty;
    document.getElementById("information-message").textContent = t.empty;

    updateLocations();
}


/* -----------------------------
   UPDATE LOCATION LABELS
   AFTER LANGUAGE CHANGE
----------------------------- */

function updateLocations() {

    if (!data) return;

    const selectedDivision = bibhagSelect.value;
    const selectedDistrict = jelaSelect.value;
    const selectedUpazila = upazilaSelect.value;

    /* Reload divisions */

    loadBibhags();

    bibhagSelect.value = selectedDivision;


    /* No division selected */

    if (selectedDivision === "") {

        jelaSelect.innerHTML = "";
        upazilaSelect.innerHTML = "";

        addOption(
            jelaSelect,
            "",
            translations[language].selectJela
        );

        addOption(
            upazilaSelect,
            "",
            translations[language].selectUpazila
        );

        jelaSelect.disabled = true;
        upazilaSelect.disabled = true;

        return;
    }


    /* Reload districts */

    const division = data.divisions[selectedDivision];

    jelaSelect.innerHTML = "";

    addOption(
        jelaSelect,
        "",
        translations[language].selectJela
    );

    division.districts.forEach((district, index) => {

        addOption(
            jelaSelect,
            index,
            district[language]
        );

    });

    jelaSelect.disabled = false;

    jelaSelect.value = selectedDistrict;


    /* No district selected */

    if (selectedDistrict === "") {

        upazilaSelect.innerHTML = "";

        addOption(
            upazilaSelect,
            "",
            translations[language].selectUpazila
        );

        upazilaSelect.disabled = true;

        return;
    }


    /* Reload upazilas */

    const district = division.districts[selectedDistrict];

    upazilaSelect.innerHTML = "";

    addOption(
        upazilaSelect,
        "",
        translations[language].selectUpazila
    );

    district.upazilas.forEach((upazila, index) => {

        addOption(
            upazilaSelect,
            index,
            upazila[language]
        );

    });

    upazilaSelect.disabled = false;

    upazilaSelect.value = selectedUpazila;
                              }let data = null;
let language = "en";

const bibhagSelect = document.getElementById("bibhag");
const jelaSelect = document.getElementById("jela");
const upazilaSelect = document.getElementById("upazila");

const translations = {
    en: {
        title: "Bangladesh Social Benefit Watch",
        explore: "Explore Bangladesh",
        bibhag: "Bibhag",
        jela: "Jela",
        upazila: "Upazila",
        selectBibhag: "Select a bibhag",
        selectJela: "Select a jela",
        selectUpazila: "Select an upazila",
        graphs: "Graphs",
        information: "Information",
        empty: "No information has been added yet."
    },

    bn: {
        title: "বাংলাদেশ সামাজিক সুবিধা পর্যবেক্ষণ",
        explore: "বাংলাদেশ অন্বেষণ করুন",
        bibhag: "বিভাগ",
        jela: "জেলা",
        upazila: "উপজেলা",
        selectBibhag: "একটি বিভাগ নির্বাচন করুন",
        selectJela: "একটি জেলা নির্বাচন করুন",
        selectUpazila: "একটি উপজেলা নির্বাচন করুন",
        graphs: "গ্রাফ",
        information: "তথ্য",
        empty: "এখনও কোনো তথ্য যোগ করা হয়নি।"
    }
};


/* -----------------------------
   LOAD BANGLADESH DATA
----------------------------- */

fetch("data/bangladesh.json")
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        return response.json();
    })
    .then(json => {
        data = json;

        console.log("Bangladesh data loaded:", data);

        initializeSelectors();
    })
    .catch(error => {
        console.error("Could not load Bangladesh data:", error);
    });


/* -----------------------------
   INITIALIZE
----------------------------- */

function initializeSelectors() {
    loadBibhags();

    jelaSelect.disabled = true;
    upazilaSelect.disabled = true;

    addOption(
        jelaSelect,
        "",
        translations[language].selectJela
    );

    addOption(
        upazilaSelect,
        "",
        translations[language].selectUpazila
    );
}


/* -----------------------------
   LOAD DIVISIONS
----------------------------- */

function loadBibhags() {
    bibhagSelect.innerHTML = "";

    addOption(
        bibhagSelect,
        "",
        translations[language].selectBibhag
    );

    data.divisions.forEach((division, index) => {
        addOption(
            bibhagSelect,
            index,
            division[language]
        );
    });
}


/* -----------------------------
   DIVISION CHANGE
----------------------------- */

bibhagSelect.addEventListener("change", function () {

    const divisionIndex = this.value;

    jelaSelect.innerHTML = "";
    upazilaSelect.innerHTML = "";

    addOption(
        jelaSelect,
        "",
        translations[language].selectJela
    );

    addOption(
        upazilaSelect,
        "",
        translations[language].selectUpazila
    );

    upazilaSelect.disabled = true;

    if (divisionIndex === "") {
        jelaSelect.disabled = true;
        return;
    }

    const division = data.divisions[divisionIndex];

    if (!division) {
        jelaSelect.disabled = true;
        return;
    }

    jelaSelect.disabled = false;

    division.districts.forEach((district, index) => {
        addOption(
            jelaSelect,
            index,
            district[language]
        );
    });
});


/* -----------------------------
   DISTRICT CHANGE
----------------------------- */

jelaSelect.addEventListener("change", function () {

    const divisionIndex = bibhagSelect.value;
    const districtIndex = this.value;

    upazilaSelect.innerHTML = "";

    addOption(
        upazilaSelect,
        "",
        translations[language].selectUpazila
    );

    if (
        divisionIndex === "" ||
        districtIndex === ""
    ) {
        upazilaSelect.disabled = true;
        return;
    }

    const division = data.divisions[divisionIndex];
    const district = division.districts[districtIndex];

    if (!district) {
        upazilaSelect.disabled = true;
        return;
    }

    upazilaSelect.disabled = false;

    district.upazilas.forEach((upazila, index) => {
        addOption(
            upazilaSelect,
            index,
            upazila[language]
        );
    });
});


/* -----------------------------
   UPSZILA CHANGE
----------------------------- */

upazilaSelect.addEventListener("change", function () {

    if (this.value === "") {
        return;
    }

    const division = data.divisions[bibhagSelect.value];
    const district = division.districts[jelaSelect.value];
    const upazila = district.upazilas[this.value];

    console.log("Selected location:", {
        bibhag: division[language],
        jela: district[language],
        upazila: upazila[language]
    });

    // This is where your graphs/information
    // can later be updated for the selected upazila.
});


/* -----------------------------
   ADD OPTION
----------------------------- */

function addOption(select, value, text) {

    const option = document.createElement("option");

    option.value = value;
    option.textContent = text;

    select.appendChild(option);
}


/* -----------------------------
   LANGUAGE BUTTONS
----------------------------- */

document
    .getElementById("english")
    .addEventListener("click", () => {
        changeLanguage("en");
    });

document
    .getElementById("bangla")
    .addEventListener("click", () => {
        changeLanguage("bn");
    });


/* -----------------------------
   CHANGE LANGUAGE
----------------------------- */

function changeLanguage(newLanguage) {

    language = newLanguage;

    const t = translations[language];

    document.documentElement.lang = language;

    document.getElementById("site-title").textContent = t.title;
    document.getElementById("explore-title").textContent = t.explore;
    document.getElementById("bibhag-label").textContent = t.bibhag;
    document.getElementById("jela-label").textContent = t.jela;
    document.getElementById("upazila-label").textContent = t.upazila;
    document.getElementById("graphs-title").textContent = t.graphs;
    document.getElementById("information-title").textContent = t.information;
    document.getElementById("graphs-message").textContent = t.empty;
    document.getElementById("information-message").textContent = t.empty;

    updateLocations();
}


/* -----------------------------
   UPDATE LOCATION LABELS
   AFTER LANGUAGE CHANGE
----------------------------- */

function updateLocations() {

    if (!data) return;

    const selectedDivision = bibhagSelect.value;
    const selectedDistrict = jelaSelect.value;
    const selectedUpazila = upazilaSelect.value;

    /* Reload divisions */

    loadBibhags();

    bibhagSelect.value = selectedDivision;


    /* No division selected */

    if (selectedDivision === "") {

        jelaSelect.innerHTML = "";
        upazilaSelect.innerHTML = "";

        addOption(
            jelaSelect,
            "",
            translations[language].selectJela
        );

        addOption(
            upazilaSelect,
            "",
            translations[language].selectUpazila
        );

        jelaSelect.disabled = true;
        upazilaSelect.disabled = true;

        return;
    }


    /* Reload districts */

    const division = data.divisions[selectedDivision];

    jelaSelect.innerHTML = "";

    addOption(
        jelaSelect,
        "",
        translations[language].selectJela
    );

    division.districts.forEach((district, index) => {

        addOption(
            jelaSelect,
            index,
            district[language]
        );

    });

    jelaSelect.disabled = false;

    jelaSelect.value = selectedDistrict;


    /* No district selected */

    if (selectedDistrict === "") {

        upazilaSelect.innerHTML = "";

        addOption(
            upazilaSelect,
            "",
            translations[language].selectUpazila
        );

        upazilaSelect.disabled = true;

        return;
    }


    /* Reload upazilas */

    const district = division.districts[selectedDistrict];

    upazilaSelect.innerHTML = "";

    addOption(
        upazilaSelect,
        "",
        translations[language].selectUpazila
    );

    district.upazilas.forEach((upazila, index) => {

        addOption(
            upazilaSelect,
            index,
            upazila[language]
        );

    });

    upazilaSelect.disabled = false;

    upazilaSelect.value = selectedUpazila;
}
    district.upazilas.forEach(upazila => {
        addOption(
            upazilaSelect,
            upazila[language],
            upazila[language]
        );
    });
});

function addOption(select, value, text) {
    const option = document.createElement("option");

    option.value = value;
    option.textContent = text;

    select.appendChild(option);
}

document.getElementById("english").addEventListener("click", function () {
    changeLanguage("en");
});

document.getElementById("bangla").addEventListener("click", function () {
    changeLanguage("bn");
});

function changeLanguage(newLanguage) {
    language = newLanguage;

    const t = translations[language];

    document.documentElement.lang = language;

    document.getElementById("site-title").textContent = t.title;
    document.getElementById("explore-title").textContent = t.explore;
    document.getElementById("bibhag-label").textContent = t.bibhag;
    document.getElementById("jela-label").textContent = t.jela;
    document.getElementById("upazila-label").textContent = t.upazila;
    document.getElementById("graphs-title").textContent = t.graphs;
    document.getElementById("information-title").textContent = t.information;
    document.getElementById("graphs-message").textContent = t.empty;
    document.getElementById("information-message").textContent = t.empty;
    
    updateLocations();
}

function updateLocations() {
    if (!data) return;

    const selectedDivision = bibhagSelect.value;
    const selectedDistrict = jelaSelect.value;

    loadBibhags();

    bibhagSelect.value = selectedDivision;

    if (selectedDivision === "") {
        jelaSelect.disabled = true;
        upazilaSelect.disabled = true;
        return;
    }

    const division = data.divisions[selectedDivision];

    jelaSelect.innerHTML = "";
    addOption(jelaSelect, "", translations[language].selectJela);

    division.districts.forEach((district, index) => {
        addOption(jelaSelect, index, district[language]);
    });

    jelaSelect.disabled = false;
    jelaSelect.value = selectedDistrict;

    if (selectedDistrict === "") {
        upazilaSelect.disabled = true;
        return;
    }

    const district = division.districts[selectedDistrict];

    upazilaSelect.innerHTML = "";
    addOption(upazilaSelect, "", translations[language].selectUpazila);

    district.upazilas.forEach(upazila => {
        addOption(
            upazilaSelect,
            upazila[language],
            upazila[language]
        );
    });

    upazilaSelect.disabled = false;
}
