$(function() {
    function PSUControlPlusViewModel(parameters) {
        var self = this;
console.log('psucontrol_plus settingsViewModel:'); //, JSON.stringify(parameters[0]));
        self.settingsViewModel = parameters[0];
        self.loginState = parameters[1];
        
        self.settings = undefined;
        // self.lightEnabled = false;
        // self.fanEnabled = false;
        self.scripts_gcode_psucontrol_post_on = ko.observable(undefined);
        self.scripts_gcode_psucontrol_pre_off = ko.observable(undefined);

        self.hasGPIO = ko.observable(true);
        self.isPSUOn = ko.observable(undefined);
        self.isLightOn = ko.observable(undefined);
        self.isFanOn = ko.observable(undefined);
        // self.fanEnabled = ko.observable(undefined);
        // self.lightEnabled = ko.observable(undefined);
        // self.powerOffPSUWhenIdle = ko.observable(undefined);
        // self.powerOffFanWhenIdle = ko.observable(undefined);
        // self.powerOffLightWhenIdle = ko.observable(undefined);

        self.psu_indicator = $("#psucontrolplus_indicator_psu");
        self.light_indicator = $("#psucontrolplus_indicator_light");
        self.fan_indicator = $("#psucontrolplus_indicator_fan");

        self.onBeforeBinding = function() {
            self.settings = self.settingsViewModel.settings;
            // self.lightEnabled(self.settings.plugins.psucontrol_plus.lightEnabled);
            // self.fanEnabled(self.settings.plugins.psucontrol_plus.fanEnabled);
            // self.powerOffPSUWhenIdle(self.settings.plugins.psucontrol_plus.powerOffPSUWhenIdle);
            // self.powerOffFanWhenIdle(self.settings.plugins.psucontrol_plus.powerOffFanWhenIdle);
            // self.powerOffLightWhenIdle(self.settings.plugins.psucontrol_plus.powerOffLightWhenIdle);
        };

        self.onSettingsShown = function () {
            self.scripts_gcode_psucontrol_post_on(self.settings.scripts.gcode["psucontrol_post_on"]());
            self.scripts_gcode_psucontrol_pre_off(self.settings.scripts.gcode["psucontrol_pre_off"]());
        };

        self.onSettingsHidden = function () {
            self.settings.plugins.psucontrol_plus.scripts_gcode_psucontrol_post_on = null;
            self.settings.plugins.psucontrol_plus.scripts_gcode_psucontrol_pre_off = null;
        };

        self.onSettingsBeforeSave = function () {
            if (self.scripts_gcode_psucontrol_post_on() !== undefined) {
                if (self.scripts_gcode_psucontrol_post_on() !== self.settings.scripts.gcode["psucontrol_post_on"]()) {
                    self.settings.plugins.psucontrol_plus.scripts_gcode_psucontrol_post_on = self.scripts_gcode_psucontrol_post_on;
                    self.settings.scripts.gcode["psucontrol_post_on"](self.scripts_gcode_psucontrol_post_on());
                }
            }

            if (self.scripts_gcode_psucontrol_pre_off() !== undefined) {
                if (self.scripts_gcode_psucontrol_pre_off() !== self.settings.scripts.gcode["psucontrol_pre_off"]()) {
                    self.settings.plugins.psucontrol_plus.scripts_gcode_psucontrol_pre_off = self.scripts_gcode_psucontrol_pre_off;
                    self.settings.scripts.gcode["psucontrol_pre_off"](self.scripts_gcode_psucontrol_pre_off());
                }
            }
            var settings = self.settings.plugins.psucontrol_plus;
            settings.powerOffWhenIdle =
                settings.powerOffPSUWhenIdle || settings.powerOffFanWhenIdle || settings.powerOffLightWhenIdle;
        };

        self.onStartup = function () {
            self.isPSUOn.subscribe(function() {
                if (self.isPSUOn()) {
                    self.psu_indicator.removeClass("off").addClass("on");
                } else {
                    self.psu_indicator.removeClass("on").addClass("off");
                }
            });
            self.isLightOn.subscribe(function() {
                if (self.isLightOn()) {
                    self.light_indicator.removeClass("off").addClass("on");
                } else {
                    self.light_indicator.removeClass("on").addClass("off");
                }
            });
            self.isFanOn.subscribe(function() {
                if (self.isFanOn()) {
                    self.fan_indicator.removeClass("off").addClass("on");
                } else {
                    self.fan_indicator.removeClass("on").addClass("off");
                }
            });

            $.ajax({
                url: API_BASEURL + "plugin/psucontrol_plus",
                type: "POST",
                dataType: "json",
                data: JSON.stringify({
                    command: "getAllState"
                }),
                contentType: "application/json; charset=UTF-8"
            }).done(function(data) {
                // console.log('getAllState: ', data);
                self.isPSUOn(data.isPSUOn);
                self.isLightOn(data.isLightOn);
                self.isFanOn(data.isFanOn);
            });
        }

        self.onDataUpdaterPluginMessage = function(plugin, data) {
            // console.log('onDataUpdaterPluginMessage', 'at (',
            //    Math.round(new Date().getTime()/1000), ') plugin:[', plugin, ']. data:', data);
            if (plugin !== "psucontrol_plus") {
                return;
            }

            if (data.hasGPIO !== undefined) {
                self.hasGPIO(data.hasGPIO);
            }

            if (data.isPSUOn !== undefined) {
                self.isPSUOn(data.isPSUOn);
            }
            if (data.isLightOn !== undefined) {
                self.isLightOn(data.isLightOn);
            }
            if (data.isFanOn !== undefined) {
                self.isFanOn(data.isFanOn);
            }
        };

        self.togglePSU = function() {
            if (self.isPSUOn()) {
                if (self.settings.plugins.psucontrol_plus.enablePowerOffWarningDialog()) {
                    showConfirmationDialog({
                        message: "You are about to turn off the PSU.",
                        onproceed: function() {
                            self.turnPSUOff();
                        }
                    });
                } else {
                    self.turnPSUOff();
                }
            } else {
                self.turnPSUOn();
            }
        };
        self.toggleLight = function() {
            if (self.isLightOn()) {
                self.turnLightOff();
            } else {
                self.turnLightOn();
            }
        };
        self.toggleFan = function() {
            if (self.isFanOn()) {
                self.turnFanOff();
            } else {
                self.turnFanOn();
            }
        };

        self.turnPSUOn = function() {self.turnOnOff("PSU", "On"); self.isPSUOn(true);};
        self.turnPSUOff = function() {self.turnOnOff("PSU", "Off"); self.isPSUOn(false);};
        self.turnLightOn = function() {self.turnOnOff("Light", "On"); self.isLightOn(true);};
        self.turnLightOff = function() {self.turnOnOff("Light", "Off"); self.isLightOn(false);};
        self.turnFanOn = function() {self.turnOnOff("Fan", "On"); self.isFanOn(true);};
        self.turnFanOff = function() {self.turnOnOff("Fan", "Off"); self.isFanOn(false);};
        self.turnOnOff = function(what, how) {
            $.ajax({
                url: API_BASEURL + "plugin/psucontrol_plus",
                type: "POST",
                dataType: "json",
                data: JSON.stringify({
                    command: "turn" + what + how
                }),
                contentType: "application/json; charset=UTF-8"
            })
        };

        // self.turnPSUOff = function() {
        //     $.ajax({
        //         url: API_BASEURL + "plugin/psucontrol",
        //         type: "POST",
        //         dataType: "json",
        //         data: JSON.stringify({
        //             command: "turnPSUOff"
        //         }),
        //         contentType: "application/json; charset=UTF-8"
        //     })
        // };
    }

    ADDITIONAL_VIEWMODELS.push([
        PSUControlPlusViewModel,
        ["settingsViewModel", "loginStateViewModel"],
        ["#navbar_plugin_psucontrol_plus", "#settings_plugin_psucontrol_plus"]
    ]);
});
