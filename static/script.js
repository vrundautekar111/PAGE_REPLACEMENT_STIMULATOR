async function runSimulation() {

    const referenceString =
        document.getElementById(
            "referenceString"
        ).value.trim();


    const frameCount =
        document.getElementById(
            "frameCount"
        ).value;


    const algorithm =
        document.getElementById(
            "algorithm"
        ).value;


    const errorMessage =
        document.getElementById(
            "errorMessage"
        );


    errorMessage.style.display = "none";


    if (!referenceString) {

        showError(
            "Please enter a reference string."
        );

        return;
    }


    if (!frameCount || frameCount <= 0) {

        showError(
            "Please enter a valid number of frames."
        );

        return;
    }


    const pages =
        referenceString.split(/\s+/);


    for (let page of pages) {

        if (isNaN(page)) {

            showError(
                "Reference string must contain only numbers."
            );

            return;
        }
    }


    try {

        const response =
            await fetch("/simulate", {

                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({

                    referenceString:
                        referenceString,

                    frameCount:
                        frameCount,

                    algorithm:
                        algorithm

                })

            });


        const data =
            await response.json();


        if (!response.ok) {

            showError(data.error);

            return;
        }


        displayResults(data);

    }

    catch (error) {

        showError(
            "Unable to connect to the server."
        );

        console.error(error);
    }
}


function displayResults(data) {

    document.getElementById(
        "resultSection"
    ).style.display = "block";


    document.getElementById(
        "algorithmResult"
    ).textContent = data.algorithm;


    document.getElementById(
        "faultResult"
    ).textContent = data.pageFaults;


    document.getElementById(
        "hitResult"
    ).textContent = data.pageHits;


    document.getElementById(
        "hitRatioResult"
    ).textContent =
        data.hitRatio + "%";


    createTable(data);


    createChart(data);


    showExplanation(data.algorithm);


    document.getElementById(
        "resultSection"
    ).scrollIntoView({
        behavior: "smooth"
    });
}


function createTable(data) {

    const tableHead =
        document.getElementById(
            "tableHead"
        );


    const tableBody =
        document.getElementById(
            "tableBody"
        );


    tableHead.innerHTML = "";

    tableBody.innerHTML = "";


    let headerRow =
        document.createElement("tr");


    let pageHeader =
        document.createElement("th");

    pageHeader.textContent =
        "Page";

    headerRow.appendChild(
        pageHeader
    );


    for (
        let i = 0;
        i < data.frameCount;
        i++
    ) {

        let th =
            document.createElement("th");

        th.textContent =
            "Frame " + (i + 1);

        headerRow.appendChild(th);
    }


    let resultHeader =
        document.createElement("th");

    resultHeader.textContent =
        "Result";

    headerRow.appendChild(
        resultHeader
    );


    tableHead.appendChild(
        headerRow
    );


    data.steps.forEach(step => {

        let row =
            document.createElement("tr");

        let pageCell =
            document.createElement("td");

        pageCell.textContent =
            step.page;

        row.appendChild(
            pageCell
        );


        for (
            let i = 0;
            i < data.frameCount;
            i++
        ) {

            let cell =
                document.createElement("td");


            if (
                i < step.frames.length
            ) {

                cell.textContent =
                    step.frames[i];

            } else {

                cell.textContent =
                    "-";
            }


            row.appendChild(cell);
        }


        let resultCell =
            document.createElement("td");


        resultCell.textContent =
            step.status;


        if (step.status === "Hit") {

            resultCell.classList.add(
                "hit"
            );

        } else {

            resultCell.classList.add(
                "fault"
            );
        }


        row.appendChild(
            resultCell
        );


        tableBody.appendChild(
            row
        );

    });
}


function createChart(data) {

    const chart =
        document.getElementById(
            "chart"
        );


    chart.innerHTML = "";


    data.steps.forEach(step => {

        const container =
            document.createElement(
                "div"
            );


        container.className =
            "bar-container";


        const pageNumber =
            document.createElement(
                "div"
            );


        pageNumber.className =
            "page-number";


        pageNumber.textContent =
            step.page;


        container.appendChild(
            pageNumber
        );


        const bar =
            document.createElement(
                "div"
            );


        bar.className = "bar";


        if (step.status === "Hit") {

            bar.classList.add(
                "hit-bar"
            );

            bar.style.height =
                "40px";

        } else {

            bar.classList.add(
                "fault-bar"
            );

            bar.style.height =
                "150px";
        }


        container.appendChild(
            bar
        );


        const label =
            document.createElement(
                "div"
            );


        label.className =
            "bar-label";


        label.textContent =
            step.status;


        container.appendChild(
            label
        );


        chart.appendChild(
            container
        );

    });
}

function showExplanation(
    algorithm
) {

    const explanation =
        document.getElementById(
            "algorithmExplanation"
        );


    if (algorithm === "FIFO") {

        explanation.innerHTML =
            `<strong>FIFO
            (First In First Out)</strong>
            removes the page that entered
            memory first. It is simple to
            implement because pages are
            maintained in queue order.`;

    }


    else if (algorithm === "LRU") {

        explanation.innerHTML =
            `<strong>LRU
            (Least Recently Used)</strong>
            removes the page that has not
            been used for the longest time.
            It uses recent page usage to
            make the replacement decision.`;

    }


    else if (algorithm === "Optimal") {

        explanation.innerHTML =
            `<strong>Optimal</strong>
            replaces the page whose next
            use occurs farthest in the future.
            It provides the theoretical minimum
            number of page faults, but in a real
            system the future reference string
            is not known in advance.`;

    }
}

function showError(message) {

    const errorMessage =
        document.getElementById(
            "errorMessage"
        );


    errorMessage.textContent =
        message;


    errorMessage.style.display =
        "block";
}


function clearSimulation() {

    document.getElementById(
        "referenceString"
    ).value = "";


    document.getElementById(
        "frameCount"
    ).value = "3";


    document.getElementById(
        "algorithm"
    ).value = "FIFO";


    document.getElementById(
        "resultSection"
    ).style.display = "none";


    document.getElementById(
        "errorMessage"
    ).style.display = "none";


    document.getElementById(
        "tableHead"
    ).innerHTML = "";


    document.getElementById(
        "tableBody"
    ).innerHTML = "";


    document.getElementById(
        "chart"
    ).innerHTML = "";
}