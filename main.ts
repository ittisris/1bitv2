function show4(num: number, line: number) {
    
    tmp = num
    for (let x = 0; x < 4; x++) {
        if (tmp % 2 == 1) {
            led.plot(x, line)
        } else {
            led.unplot(x, line)
        }
        
        tmp = Math.floor(tmp / 2)
    }
}

function showIO() {
    let x2 = 0
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

input.onButtonPressed(Button.A, function on_button_pressed_a() {
    reset()
})
function clkPosEdge() {
    
    if (pins.digitalReadPin(DigitalPin.P2) == 1) {
        writeIO()
    }
    
    pins.digitalWritePin(DigitalPin.P1, 1)
    pc = pc + 1
    if (pc == opcode.length) {
        pc = 0
    }
    
    basic.pause(500)
}

function clkNegEdge() {
    sendInstruc()
    basic.pause(100)
    pins.digitalWritePin(DigitalPin.P1, 0)
    basic.pause(500)
}

function readIO() {
    if (pc == 0) {
        input_port[pc] = pins.digitalReadPin(DigitalPin.P12)
        showIO()
    }
    
    pins.digitalWritePin(DigitalPin.P0, input_port[ioaddress[pc]])
}

function writeIO() {
    output_port[ioaddress[pc]] = pins.digitalReadPin(DigitalPin.P0)
    showIO()
}

input.onButtonPressed(Button.AB, function on_button_pressed_ab() {
    
    endless = true
    while (endless) {
        clkNegEdge()
        clkPosEdge()
    }
})
input.onButtonPressed(Button.B, function on_button_pressed_b() {
    clkNegEdge()
    clkPosEdge()
})
function sendInstruc() {
    
    instruc = opcode[pc]
    show4(pc, 0)
    show4(instruc, 1)
    readIO()
    pins.digitalWritePin(DigitalPin.P13, instruc % 2)
    instruc = Math.floor(instruc / 2)
    pins.digitalWritePin(DigitalPin.P14, instruc % 2)
    instruc = Math.floor(instruc / 2)
    pins.digitalWritePin(DigitalPin.P15, instruc % 2)
    instruc = Math.floor(instruc / 2)
    pins.digitalWritePin(DigitalPin.P16, instruc % 2)
}

function reset() {
    
    endless = false
    pins.digitalWritePin(DigitalPin.P8, 1)
    pins.digitalWritePin(DigitalPin.P1, 1)
    pc = 0
    basic.showString("R")
    basic.pause(100)
    pins.digitalWritePin(DigitalPin.P8, 0)
    basic.clearScreen()
}

let instruc = 0
let endless = false
let pc = 0
let tmp = 0
let output_port : number[] = []
let input_port : number[] = []
let ioaddress : number[] = []
let opcode : number[] = []
led.setBrightness(50)
opcode = [0, 1, 2, 3, 4, 5, 6]
ioaddress = [0, 1, 0, 1, 0, 1, 0]
input_port = [0, 0, 0]
output_port = [0, 0, 0]
pins.setPull(DigitalPin.P0, PinPullMode.PullUp)
pins.setPull(DigitalPin.P1, PinPullMode.PullUp)
pins.setPull(DigitalPin.P8, PinPullMode.PullDown)
tmp = pins.digitalReadPin(DigitalPin.P0)
reset()
basic.forever(function on_forever() {
    basic.pause(100)
})
