(function() {
    "use strict ";
    let translation = {
        "sound_ogg": "http://path/to/sound.ogg",
        "sound_base64": "base 64 raw data",
        "error_content_raw": "No content defined for QRcode",
        "error_content_firstname": "First name is mandatory",
        "error_content_lastname": "Last name is mandatory.",
        "error_content_file_missing": "The file is missing.",
        "error_correction_level": "Incorrect value for error correction.",
        "error_format": "The format is not valid.",
        "error_pixel_size": "The pixel size is invalid."
    };

    let content_type = document.getElementById("content-type");

    let content_raw = document.getElementById("content-raw");

    let content_gender = document.getElementsByName("content-gender");
    let content_title = document.getElementById("content-title");
    let content_firstname = document.getElementById("content-firstname");
    let content_lastname = document.getElementById("content-lastname");
    let content_nickname = document.getElementById("content-nickname");
    let content_suffix = document.getElementById("content-suffix");
    let content_anniversary = document.getElementById("content-anniversary");
    let content_birthday = document.getElementById("content-birthday");
    let content_sound = document.getElementById("content-sound");
    let content_sound_type = document.getElementById("content-sound-type");

    let content_tel_cell = document.getElementById("content-tel-cell");
    let content_tel_home = document.getElementById("content-tel-home");
    let content_tel_work = document.getElementById("content-tel-work");
    let content_email = document.getElementById("content-email");
    let content_mail_post_office_box = document.getElementById("content-mail-post-office-box");
    let content_mail_street = document.getElementById("content-mail-street");
    let content_mail_street_extended = document.getElementById("content-mail-street-extended");
    let content_mail_locality = document.getElementById("content-mail-locality");
    let content_mail_region = document.getElementById("content-mail-region");
    let content_mail_postal_code = document.getElementById("content-mail-postal-code");
    let content_mail_country = document.getElementById("content-mail-country");
    let content_url = document.getElementById("content-url");
    let content_impp = document.getElementById("content-impp");

    let content_job_organization = document.getElementById("content-job-organization");
    let content_job_role = document.getElementById("content-job-role");
    let content_job_title = document.getElementById("content-job-title");

    //let content_geo_latitude = document.getElementById("content-geo-latitude");
    //let content_geo_longitude = document.getElementById("content-geo-longitude");
    //let content_kind = document.getElementById("content-kind");
    //let content_logo = document.getElementById("content-logo");
    //let content_photo = document.getElementById("content-photo");
    //let content_source = document.getElementById("content-photo");

    let content_file = document.getElementById("content-file");

    let pixel_size = document.getElementById("pixel_size");
    let error_correction_level = document.getElementById("error_correction_level");
    let format = document.getElementById("format");
    let submit_button = document.getElementById("submit");
    let reset_button = document.getElementById("reset");
    let render = document.getElementById("render");

    let output = document.getElementById("output");
    let output_qrcode = document.getElementById("output_qrcode");
    let output_download = document.getElementById("output_download");

    let error = null;
    let error_container = document.getElementById("modal_error");
    let error_body = document.getElementById("modal_error_body");

    window.addEventListener("load", load, false);
    window.addEventListener("unload", unload, false);

    /* main */
    let cache = {
        "format": "gif",
        "tab": "raw",
        "qrcode": null
    };
    content_type = content_type.getElementsByTagName("button");

    function load() {
        reset_raw();
        reset_vcard();
        reset_file();
        reset_option();

        content_sound_type.addEventListener("change", toggle_sound, false);

        for (let i = 0, size = content_type.length; i < size; i++) {
            content_type[i].addEventListener("click", toggle_nav, false);
        }
        submit_button.addEventListener("click", generate, false);
        reset_button.addEventListener("click", reset_option, false);

        error = new bootstrap.Modal(error_container);
    }

    function toggle_nav(e) {
        let target = e.target.getAttribute("data-bs-target").slice(5);
        if (target === cache.tab) return;
        cache.tab = target;
    }

    function toggle_sound() {
        switch (content_sound_type.value) {
            case "ogg":
                content_sound.placeholder = translation.sound_ogg;
                break;

            case "base64":
                content_sound.placeholder = translation.sound_base64;
                break;
        }
    }

    function generate() {
        submit_button.blur();

        let hasError = [];
        let option = {
            errorCorrectionLevel: 0,
            format: "gif",
            pixelSize: 2,
            text: "",
            typeNumber: 0,
        };

        /* QRCode content */
        let value;
        switch (cache.tab) {
            case "raw":
                if (content_raw.value === "") {
                    hasError.push(translation.error_content_raw);
                } else {
                    option.text = content_raw.value;
                }
                break;

            case "vcard":
                if (content_firstname.value === "") {
                    hasError.push(translation.error_content_firstname);
                }
                if (content_lastname.value === "") {
                    hasError.push(translation.error_content_lastname);
                }

                if (hasError.length === 0) {
                    option.text = [];
                    /* name */
                    option.text.push("N:" + content_lastname.value + ";" + content_firstname.value + ";" + content_title.value + ";" + content_suffix.value);
                    /* gender */
                    value = "";
                    for (let i = 0, length = content_gender.length; i < length; i++) {
                        if (content_gender[i].checked) {
                            value = content_gender[i].value;
                            break;
                        }
                    }
                    if (value !== "") option.text.push("GENDER:" + value);
                    /* formated name */
                    value = [];
                    if (content_title.value !== "") value.push(content_title.value);
                    value.push(content_firstname.value);
                    value.push(content_lastname.value);
                    if (content_suffix.value !== "") value.push(content_suffix.value);
                    option.text.push("FN:" + value.join(" "));
                    /* nickmane */
                    if (content_nickname.value !== "") option.text.push("NICKNAME:" + content_nickname.value);
                    /* sound */
                    if (content_sound.value !== "") {
                        switch (content_sound_type.value) {
                            case "ogg":
                                option.text.push("SOUND;MEDIATYPE=audio/ogg:" + content_sound.value);
                                break;
                            case "base64":
                                option.text.push("SOUND:data:audio/ogg;base64," + content_sound.value.replace(/^base64,/i, ''));
                                break;
                        }
                    }
                    /* anniversary */
                    if (content_anniversary.value !== "") option.text.push("ANNIVERSARY:" + parseInt(content_anniversary.value.replace(/-/g, '')));
                    /* birthday */
                    if (content_birthday.value !== "") option.text.push("BDAY:" + parseInt(content_birthday.value.replace(/-/g, '')));


                    /* telephone */
                    if (content_tel_home.value !== "" || content_tel_work.value !== "" || content_tel_cell.value !== "") {
                        value = [];
                        if (content_tel_cell.value !== "") value.push("TYPE=cell:" + content_tel_cell.value);
                        if (content_tel_home.value !== "") value.push("TYPE=home:" + content_tel_home.value);
                        if (content_tel_work.value !== "") value.push("TYPE=work:" + content_tel_work.value);
                        option.text.push("TEL;" + value.join(";"));
                    }
                    /* email */
                    if (content_email.value !== "") option.text.push("EMAIL:" + content_email.value);
                    /* address */
                    if (content_mail_post_office_box.value !== "" || content_mail_street.value !== "" || content_mail_locality.value !== "" || content_mail_region.value !== "" || content_mail_postal_code.value !== "" || content_mail_country.value !== "") {
                        option.text.push("ADR;TYPE=intl:" + content_mail_post_office_box.value + ";" + content_mail_street_extended.value + ";" + content_mail_street.value + ";" + content_mail_locality.value + ";" + content_mail_region.value + ";" + content_mail_postal_code.value + ";" + content_mail_country.value);
                    }
                    /* web site */
                    if (content_url.value !== "") option.text.push("URL:" + content_url.value);
                    /* IMPP */
                    if (content_impp.value !== "") option.text.push("IMPP:" + content_impp.value);
                    /* job organization */
                    if (content_job_organization.value !== "") option.text.push("ORG:" + content_job_organization.value);
                    /* job role */
                    if (content_job_role.value !== "") option.text.push("ROLE:" + content_job_role.value);
                    /* job title */
                    if (content_job_title.value !== "") option.text.push("TITLE:" + content_job_title.value);
                    /* other */

                    option.text = option.text.sort();
                    option.text.unshift("VERSION:V4.0");
                    option.text.unshift("BEGIN:VCARD");
                    option.text.push("END:VCARD");
                    option.text = option.text.join("\n");
                }
                break;

            case "file":
                if (content_file.value === "") {
                    hasError.push(translation.error_content_file_missing);
                }
                break;
        }

        /* filters */
        value = parseInt(pixel_size.value);
        if (value < 1) {
            hasError.push(translation.error_pixel_size);
        } else {
            option.pixelSize = value;
        }

        value = ["H", "L", "M", "Q"];
        if (value.indexOf(error_correction_level.value) === -1) {
            hasError.push(translation.error_correction_level);
        } else {
            option.errorCorrectionLevel = error_correction_level.value;
        }

        value = ["ascii", "gif", "svg", "table"];
        if (value.indexOf(format.value) === -1) {
            hasError.push(translation.error_format);
        } else {
            option.format = format.value;
            cache.format = format.value;
        }

        if (hasError.length > 0) {
            error_body.innerText = hasError.join("\n");
            error.show();
            return;
        }

        /* create QRCode */
        try {
            let qr = qrcode(option.typeNumber, option.errorCorrectionLevel);
            qr.addData(option.text, "Byte"); // Numeric / Alphanumeric / Byte (default) / Kanji
            qr.make();
            cache.qrcode = qr.createDataURL(option.pixelSize, 0);
            output_qrcode.classList.remove("ascii");
            output_qrcode.classList.remove("image");
            output_qrcode.classList.remove("svg");
            output_qrcode.classList.remove("table");

            switch (option.format) {
                case "ascii":
                    output_qrcode.classList.add("ascii");
                    output_qrcode.innerHTML = qr.createASCII(option.pixelSize, 0);
                    break;

                case "gif":
                    output_qrcode.classList.add("image");
                    output_qrcode.innerHTML = qr.createImgTag(option.pixelSize, 0);
                    break;

                case "svg":
                    output_qrcode.classList.add("svg");
                    output_qrcode.innerHTML = qr.createSvgTag(option.pixelSize, 0);
                    break;

                case "table":
                    output_qrcode.classList.add("table");
                    output_qrcode.innerHTML = qr.createTableTag(option.pixelSize, 0);
                    break;
            }
            output_download.addEventListener("click", download, false);
            output.classList.remove("hide");
        } catch (err) {
            error_body.innerText = err;
            error.show();
        }
    }

    function download() {
        let filename = "qrcode.";
        console.log(cache.format);
        switch (cache.format) {
            case "ascii":
                filename += "txt";
                cache.qrcode = output_qrcode.innerHTML;
                break;

            case "gif":
                filename += "gif";
                break;

            case "svg":
                filename += "svg";
                cache.qrcode = output_qrcode.innerHTML;
                break;

            case "table":
                filename += "php";
                cache.qrcode = output_qrcode.innerHTML;
                break;
        }

        let a = document.createElement("a");
        a.href = cache.qrcode;
        a.setAttribute("download", filename);
        a.click();
    }

    function reset_raw() {
        content_raw.innerHTML = "";
    }

    function reset_vcard() {
        content_gender.value = "";
        for (var i = 0, size = content_gender.length; i < size; i++) {
            content_gender[i].checked = false;
        }
        content_title.value = "";
        content_firstname.value = "";
        content_lastname.value = "";
        content_nickname.value = "";
        content_suffix.value = "";
        content_birthday.value = "";
        content_anniversary.value = "";
        content_sound_type.value = "ogg";
        content_sound.value = "";
        content_sound.placeholder = translation.sound_ogg;

        content_tel_cell.value = "";
        content_tel_home.value = "";
        content_tel_work.value = "";
        content_email.value = "";
        content_mail_post_office_box.value = "";
        content_mail_street.value = "";
        content_mail_street_extended.value = "";
        content_mail_locality.value = "";
        content_mail_region.value = "";
        content_mail_postal_code.value = "";
        content_mail_country.value = "";
        content_url.value = "";
        content_impp.value = "";

        content_job_organization.value = "";
        content_job_role.value = "";
        content_job_title.value = "";
    }

    function reset_file() {
        content_file.value = "";
    }

    function reset_option() {
        reset_button.blur();

        pixel_size.value = 2;
        error_correction_level.value = "M";
        format.value = "gif";

        output_download.removeEventListener("click", download, false);
        output.classList.add("hide");
        output_qrcode.innerText = "";

        cache.format = "gif";
        cache.qrcode = null;
    }

    function unload() {
        content_sound_type.removeEventListener("change", toggle_sound, false);

        for (let i = 0, size = content_type.length; i < size; i++) {
            content_type[i].removeEventListener("click", toggle_nav, false);
        }
        submit_button.removeEventListener("click", generate, false);
        reset_button.removeEventListener("click", reset, false);
    }
}());