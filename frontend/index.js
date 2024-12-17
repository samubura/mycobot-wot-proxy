
function get_td(addr) {
    servient.start().then((thingFactory) => {
        helpers
            .fetch(addr)
            .then((td) => {
                console.log(td);
                thingFactory.consume(td).then((thing) => {
                    removeInteractions();
                    showInteractions(thing);
                });
            })
            .catch((error) => {
                window.alert("Could not fetch TD.\n" + error);
            });
    });
}

function showInteractions(thing) {
    for (let property in thing.getThingDescription().properties) {
        if (thing.getThingDescription().properties.hasOwnProperty(property)) {
            let item = $("<div class=row></div>");
            let button = $("<button class='col-2 mt-3 btn btn-primary'></button>").text(property);
            item.append(button);
            $("#properties").append(item);
            item.click(() => {
                item.find(".result").remove(); // Remove any previous result elements
                thing
                    .readProperty(property)
                    .then(async (res) => {
                        let value = await res.value();
                        let resultElement = $("<div class='mt-2 col result text-left align-self-center'></div>").text(property + ": " + JSON.stringify(value));
                        item.append(resultElement);
                    })
                    .catch((err) => {
                        let errorElement = $("<div class='mt-2 text-danger col result text-left align-self-center'></div>").text("Error: " + err);
                        item.append(errorElement);
                    });
            });
        }
    }

    for (let action in thing.getThingDescription().actions) {
        let item = $("<div class='container mb-3'></div>");
        let title = $("<h5 class='row mt-3 font-weight-bold'></h5>").text(action);
        let form = $("<form class='row'></form>");
        let inputSchema = thing.getThingDescription().actions[action].input;

        if (inputSchema && inputSchema.properties) {
            for (let field in inputSchema.properties) {
                if (inputSchema.properties.hasOwnProperty(field)) {
                    let fieldElement = $("<div class='form-group col-2'></div>");
                    let label = $("<label class='mr-2'></label>").text(field);
                    let input = $("<input class='form-control' type='text'>").attr("name", field);
                    fieldElement.append(label).append(input);
                    form.append(fieldElement);
                }
            }
        }
        let submit = $("<div class='row'></div>");
        let button = $("<button class='col-2r btn btn-primary ml-2'></button>").text(action);
        submit.append(button);

        item.append(title);
        item.append(form);
        item.append(submit);
        $("#actions").append(item);

        button.click(() => {
            item.find(".result").remove(); // Remove any previous result elements
            let formData = {};
            form.serializeArray().forEach((input) => {
                formData[input.name] = JSON.parse(input.value);
            });
            thing
                .invokeAction(action, formData)
                .then(async (res) => {
                    let value = await res.value();
                    let resultElement = $("<div class='mt-2 col result text-left align-self-center'></div>").text(action + ": " + JSON.stringify(value));
                    submit.append(resultElement);
                })
                .catch((err) => {
                    let errorElement = $("<div class='mt-2 text-danger col result text-left align-self-center'></div>").text("Error: " + err);
                    submit.append(errorElement);
                });
        });
    }
}

function removeInteractions() {
    ["#properties", "#actions", "#events"].forEach((element) => {
        $(element).empty();
    });
}


var servient = new Wot.Core.Servient();
servient.addClientFactory(new Wot.Http.HttpClientFactory());
var helpers = new Wot.Core.Helpers(servient);

$("#fetch").click(() => {
    get_td($("#td-url").val());
});
