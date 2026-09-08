let data;
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

fetch("data/bangladesh.json")
    .then(response => response.json())
    .then(json => {
        data = json;
        loadBibhags();
    })
    .catch(error => {
        console.error("Could not load Bangladesh data:", error);
    });

function loadBibhags() {
    bibhagSelect.innerHTML = "";
    addOption(bibhagSelect, "", translations[language].selectBibhag);

    data.divisions.forEach((division, index) => {
        addOption(
            bibhagSelect,
            index,
            division[language]
        );
    });
}

bibhagSelect.addEventListener("change", function () {
    const division = data.divisions[this.value];

    jelaSelect.innerHTML = "";
    upazilaSelect.innerHTML = "";

    addOption(jelaSelect, "", translations[language].selectJela);
    addOption(upazilaSelect, "", translations[language].selectUpazila);

    upazilaSelect.disabled = true;

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

jelaSelect.addEventListener("change", function () {
    const division = data.divisions[bibhagSelect.value];
    const district = division.districts[this.value];

    upazilaSelect.innerHTML = "";
    addOption(upazilaSelect, "", translations[language].selectUpazila);

    if (!district) {
        upazilaSelect.disabled = true;
        return;
    }

    upazilaSelect.disabled = false;

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
