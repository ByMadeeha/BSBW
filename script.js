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


// -------------------------
// LOAD JSON
// -------------------------

fetch("data/bangladesh.json")
    .then(response => {
        if (!response.ok) {
            throw new Error("Could not find data/bangladesh.json");
        }

        return response.json();
    })
    .then(json => {
        if (!json.divisions) {
            throw new Error("JSON does not contain 'divisions'");
        }

        data = json;

        loadBibhags();

        jelaSelect.disabled = true;
        upazilaSelect.disabled = true;
    })
    .catch(error => {
        console.error("Bangladesh data error:", error);
    });


// -------------------------
// LOAD DIVISIONS
// -------------------------

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


// -------------------------
// DIVISION CHANGED
// -------------------------

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

    if (!division || !division.districts) {
        jelaSelect.disabled = true;
        return;
    }

    division.districts.forEach((district, index) => {
        addOption(
            jelaSelect,
            index,
            district[language]
        );
    });

    jelaSelect.disabled = false;
});


// -------------------------
// DISTRICT CHANGED
// -------------------------

jelaSelect.addEventListener("change", function () {

    const divisionIndex = bibhagSelect.value;
    const districtIndex = this.value;

    upazilaSelect.innerHTML = "";

    addOption(
        upazilaSelect,
        "",
        translations[language].selectUpazila
    );

    if (divisionIndex === "" || districtIndex === "") {
        upazilaSelect.disabled = true;
        return;
    }

    const division = data.divisions[divisionIndex];

    if (!division) {
        upazilaSelect.disabled = true;
        return;
    }

    const district = division.districts[districtIndex];

    if (!district || !district.upazilas) {
        upazilaSelect.disabled = true;
        return;
    }

    district.upazilas.forEach((upazila, index) => {

        addOption(
            upazilaSelect,
            index,
            upazila[language]
        );

    });

    upazilaSelect.disabled = false;
});


// -------------------------
// ADD OPTION
// -------------------------

function addOption(select, value, text) {

    const option = document.createElement("option");

    option.value = value;
    option.textContent = text;

    select.appendChild(option);
}


// -------------------------
// LANGUAGE BUTTONS
// -------------------------

document.getElementById("english").addEventListener("click", function () {
    changeLanguage("en");
});

document.getElementById("bangla").addEventListener("click", function () {
    changeLanguage("bn");
});


// -------------------------
// CHANGE LANGUAGE
// -------------------------

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

    if (data) {
        refreshLocations();
    }
}


// -------------------------
// REFRESH LOCATION SELECTORS
// -------------------------

function refreshLocations() {

    const selectedDivision = bibhagSelect.value;
    const selectedDistrict = jelaSelect.value;
    const selectedUpazila = upazilaSelect.value;

    loadBibhags();

    bibhagSelect.value = selectedDivision;

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
