#!/usr/bin/env bash

# How to list the emulators
#     avdmanager list avd

# How to delete an emulator
#     avdmanager delete avd --name=THE_NAME_COPY_FROM_LIST

emulator_name=react-native-init-0560

avdmanager create avd \
  --name ${emulator_name} \
  --package "system-images;android-26;google_apis;x86_64" \
  --sdcard 300M \
  --device "Nexus 5X"

# TODO: find out how to install skins
cat >> $HOME/.android/avd/${emulator_name}.avd/config.ini << EOF
hw.ramSize=2048
showDeviceFrame=yes
hw.gpu.enabled=yes
hw.gpu.mode=host
hw.keyboard=yes
hw.camera.front=emulated
hw.camera.back=virtualscene
skin.path=_no_skin
EOF

echo ""
echo "Emulator has been created."
echo ""
