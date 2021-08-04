# OctoPrint PSU Control Plus
This OctoPrint plugin controls an ATX/AUX power supply to help reduce power consumption and noise when the printer is not in use.

Power supply can be automatically switched on when user specified commands are sent to the printer and/or switched off when idle.

Supports Commands (G-Code or System) or GPIO to switch power supply on/off.

## Plus
The Plus in this plugin is an addition to support GPIO control over two more pins, designated
for light and a fan. Unlike the PSU, these two additional controls can be disabled, and like the PSU
they can be automatically turned off when printer is idle and cold.
 
 
## Setup
Install the plugin using Plugin Manager from Settings
 
## Settings
See the [Wiki](https://github.com/kantlivelong/OctoPrint-PSUControl/wiki/Settings)
for the PSU. The Plus additions for light and fan extends existing PSU properties
where relevant.

Set parameters from the PSUControlPlus control page. 

### Figures:

[PSUControl 1,](psucontrol_plus_navbar_plus_settings-1.png?raw=true)
[2,](psucontrol_plus_navbar_plus_settings-2.png?raw=true)
[3,](psucontrol_plus_navbar_plus_settings-3.png?raw=true)
[4.](psucontrol_plus_navbar_plus_settings-4.png?raw=true)

 
## Troubleshooting
See the [Wiki](https://github.com/kantlivelong/OctoPrint-PSUControl/wiki/Troubleshooting)
for only the PSU part.

## API
See the [Wiki](https://github.com/kantlivelong/OctoPrint-PSUControl/wiki/API)
for only the PSU part.

### API extensions
Replace in all action commands the substring 'PSU' with 'Light' and 'Fan',
respectively to apply action on the light and fan pins.

Also, the getPSUState command is replaces with getAllState command
which returns a json object with all 3 states.

## Support
Help can be found at the [OctoPrint Community Forums](https://community.octoprint.org)

## Feature Requests
[![Feature Requests](https://feathub.com/kantlivelong/OctoPrint-PSUControl?format=svg)](https://feathub.com/kantlivelong/OctoPrint-PSUControl)
TBD
