//% deprecated
namespace makerbit { }

namespace modules {
    /**
     * Maker:bit motor 1
     */
    //% fixedInstance whenUsed block="makerbit motor A"
    export const makerbitMotorA = new MotorClient("makerbit motor A?dev=self&srvo=0&name=A")
    /**
     * Maker:bit motor 2
     */
    //% fixedInstance whenUsed block="makerbit motor B"
    export const makerbitMotorB = new MotorClient("makerbit motor B?dev=self&srvo=1&name=B")
}

namespace servers {
    function sync(server: jacdac.Server, motor: MakerBitMotor) {
        const speed = server.value
        const enabled = !!server.intensity
        if (speed === 0 || isNaN(speed) || !enabled) {
            makerbit.stopMotor(motor)
        } else {
            makerbit.setMotorRotation(
                motor,
                speed >= 0 ? MakerBitMotorRotation.Forward : MakerBitMotorRotation.Backward
            )
            makerbit.runMotor(motor, Math.abs(speed) * 100)
        }
    }

    function start() {
        jacdac.productIdentifier = 0x3cadc101
        jacdac.deviceDescription = "MakerBit Motor"
        jacdac.startSelfServers(() => [
            jacdac.createActuatorServer(
                jacdac.SRV_MOTOR,
                (server) => sync(server, MakerBitMotor.A), {
                instanceName: "A",
                valuePackFormat: jacdac.MotorRegPack.Speed,
                intensityPackFormat: jacdac.MotorRegPack.Enabled,
            }),
            jacdac.createActuatorServer(
                jacdac.SRV_MOTOR,
                (server) => sync(server, MakerBitMotor.B), {
                instanceName: "B", valuePackFormat: jacdac.MotorRegPack.Speed,
                intensityPackFormat: jacdac.MotorRegPack.Enabled,
            }),
        ])
    }
    start()
}