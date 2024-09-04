chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        function: functionToInject
    });
});

function functionToInject() {

    /****************** AGREGAR BOTONES ******************/

    function incrustarHTML() {

        const div = document.createElement('span');
        div.innerHTML = `
            <button type="button" id="procesar-data" onClick='(function() {

                let json = JSON.parse(document.getElementById("cuotas-data").value);
                console.log("json", json);

                require(["N/currentRecord"], function (currentRecord) {
                    currentRecord = currentRecord.get();

                    try {
                        currentRecord.setValue("entity", json.empleado_rtc);
                        currentRecord.setValue("subsidiary", json.subsidiaria);
                        currentRecord.setText("item", json.articulo);
                        currentRecord.setValue("year", json.anio);

                        setTimeout(function () {
                            for (let mes in json.presupuestos) {
                                let index = mes.split("_")[0];
                                currentRecord.selectLine("budget", index)
                                currentRecord.setCurrentSublistValue("budget", "amount", json.presupuestos[mes]);
                            }
                        }, 1000);

                        // setTimeout(function () {
                        //     document.getElementById("btn_multibutton_submitter").click();
                        // }, 2000);
                    } catch (error) {
                        console.log("Ocurrio un error al ejecutar el codigo", error);
                    }
                });

            })()'>Procesar data</button>
        `;
        return div;
    }

    function crearTextArea(id) {

        const textArea = document.createElement('textarea');
        textArea.id = id;
        textArea.style.width = '100%';
        textArea.style.height = '100px';
        textArea.style.fontFamily = 'monospace'; // Cambiar la fuente a monospace
        return textArea;
    }

    function agregarBotones() {

        const h1Element = document.querySelector('h1.uir-record-type');
        if (h1Element) {
            const html = incrustarHTML();
            const textAreaCuotasData = crearTextArea('cuotas-data');
            h1Element.append(html, textAreaCuotasData);

        } else {
            console.error('No se encontró la etiqueta nav con aria-label="Principal".');
        }
    }

    // Validar que los botones ya fueron creados
    if (!document.getElementById('procesar-data')) {
        agregarBotones();
    }
}
