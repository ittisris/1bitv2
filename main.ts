function show4 (num: number, line: number) {
    tmp = num
    for (let x = 0; x <= 3; x++) {
        if (tmp % 2 == 1) {
            led.plot(x, line)
        } else {
            led.unplot(x, line)
        }
        tmp = Math.floor(tmp / 2)
    }
}
function showIO () {
    while (x2 <= input_port.length) {
        if (input_port[x2] == 1) {
            led.plot(x2, 3)
        } else {
            led.unplot(x2, 3)
        }
        if (output_port[x2] == 1) {
            led.plot(x2, 4)
        } else {
            led.unplot(x2, 4)
        }
        x2 += 1
    }
}
input.onButtonPressed(Button.A, function () {
    endless = false
    reset()
})
function clkPosEdge () {
    if (pins.digitalReadPin(DigitalPin.P2) == 1) {
        writeIO()
        led.plot(4, 0)
    } else {
        led.unplot(4, 0)
    }
    pins.digitalWritePin(DigitalPin.P1, 1)
    pc = pc + 1
    if (pc == opcode.length) {
        pc = 0
    }
    basic.pause(500)
}
function clkNegEdge () {
    sendInstruc()
    basic.pause(100)
    pins.digitalWritePin(DigitalPin.P1, 0)
    basic.pause(500)
}
function readIO () {
    if (pc == 0) {
        input_port[ioaddress[pc]] = pins.digitalReadPin(DigitalPin.P3)
        showIO()
    }
    pins.digitalWritePin(DigitalPin.P0, input_port[ioaddress[pc]])
}
function writeIO () {
    output_port[ioaddress[pc]] = pins.digitalReadPin(DigitalPin.P0)
    if (pins.digitalReadPin(DigitalPin.P0) == 1) {
        led.plot(4, 1)
    } else {
        led.unplot(4, 1)
    }
    showIO()
}
input.onButtonPressed(Button.AB, function () {
    endless = true
    while (endless) {
        clkNegEdge()
        clkPosEdge()
    }
})
input.onButtonPressed(Button.B, function () {
    clkNegEdge()
    clkPosEdge()
})
function sendInstruc () {
    instruc = opcode[pc]
    show4(pc, 0)
    show4(instruc, 1)
    show4(ioaddress[pc], 2)
    readIO()
    pins.digitalWritePin(DigitalPin.P13, instruc % 2)
    instruc = Math.floor(instruc / 2)
    pins.digitalWritePin(DigitalPin.P14, instruc % 2)
    instruc = Math.floor(instruc / 2)
    pins.digitalWritePin(DigitalPin.P15, instruc % 2)
    instruc = Math.floor(instruc / 2)
    pins.digitalWritePin(DigitalPin.P16, instruc % 2)
}
function reset () {
    pins.digitalWritePin(DigitalPin.P8, 1)
    pins.setPull(DigitalPin.P0, PinPullMode.PullNone)
    pins.setPull(DigitalPin.P1, PinPullMode.PullUp)
    pins.setPull(DigitalPin.P2, PinPullMode.PullDown)
    pins.setPull(DigitalPin.P3, PinPullMode.PullNone)
    pins.setPull(DigitalPin.P8, PinPullMode.PullDown)
    tmp = pins.digitalReadPin(DigitalPin.P0)
    tmp = pins.digitalReadPin(DigitalPin.P2)
    tmp = pins.digitalReadPin(DigitalPin.P3)
    pins.digitalWritePin(DigitalPin.P1, 1)
    pc = 0
    basic.showString("R")
    basic.pause(100)
    pins.digitalWritePin(DigitalPin.P8, 0)
    basic.clearScreen()
}
let instruc = 0
let pc = 0
let x2 = 0
let tmp = 0
let endless = false
let output_port: number[] = []
let input_port: number[] = []
let ioaddress: number[] = []
let opcode: number[] = []
led.setBrightness(50)
opcode = [
0,
12,
13,
15,
0,
12,
13,
15
]
ioaddress = [
0,
1,
0,
1,
0,
1,
0,
1
]
input_port = [1, 0, 1]
output_port = [1, 0, 1]
endless = false
reset()
basic.forever(function () {
    basic.pause(100)
})
