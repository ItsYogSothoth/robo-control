<script setup>
import RobotSteering from './controls/RobotSteering.vue'
</script>

<script>
const PRIMARY_SERVICE = '0000ffe0-0000-1000-8000-00805f9b34fb'
const CONTROLS = '0000ffe1-0000-1000-8000-00805f9b34fb'

export default {
    methods: {
        getBluetoothDevices() {
            navigator.bluetooth.requestDevice({filters: [{ services: [PRIMARY_SERVICE] }]})
                .then(this.handleGetDevices)
                .catch(() => {
                    console.log("User cancelled")
                })
        },
        handleGetDevices(device) {
            console.log(device)
            this.device = device
            this.device.addEventListener('gattserverdisconnected', this.forgetBluetoothDevice)
            this.device.gatt.connect()
                .then(server => {
                    this.setConnectionStatus(server)
                    return server.getPrimaryService(PRIMARY_SERVICE)
                })
                .then(service => {
                    return service.getCharacteristic(CONTROLS);
                })
                .then(this.setCharacteristic)
        },
        setConnectionStatus(server = null) {
            this.connectionStatus = server?.connected ? 'Connected' : 'Disconnected'
        },
        setCharacteristic(characteristic) {
            this.characteristic = characteristic
        },
        forgetBluetoothDevice() {
            this.device.gatt.disconnect()
            this.characteristic = null
            this.device = null
            this.setConnectionStatus()
        },
        controlCommand(command) {
            console.log(command)
            let textEncoder = new TextEncoder();
            this.characteristic.writeValue(textEncoder.encode(command.toUpperCase()))
        }
    },
    data() {
        return {
            device: null,
            characteristic: null,
            connectionStatus: 'Disconnected'
        }
    }
}
</script>

<template>
    <div class="container mx-auto dark:text-white pt-2">
        <div>
            <button type="button" class="btn btn-success text-white mx-1" @click="getBluetoothDevices">Connect</button>
            <button type="button" class="btn btn-error text-white" :disabled="device === null" @click="forgetBluetoothDevice">Disconnect</button>
        </div>
        <p>Connected device: {{ device?.name }}</p>
        <p>Connection status: {{ connectionStatus }}</p>
        <RobotSteering :disableControls="characteristic == null" @control-command="controlCommand"></RobotSteering>
    </div>
</template>