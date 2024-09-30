function moveForward () {
    if (!(isOperating)) {
        return
    }
    cuteBot.motors(speed, speed)
    basic.clearScreen()
    led.plot(0, 4)
    led.plot(4, 4)
}
function turnLeft () {
    if (!(isOperating)) {
        return
    }
    cuteBot.motors(-1 * turnSpeed, turnSpeed)
    basic.clearScreen()
    led.plot(4, 2)
    music.play(music.createSoundExpression(WaveShape.Square, 1, 4557, 219, 219, 100, SoundExpressionEffect.Vibrato, InterpolationCurve.Linear), music.PlaybackMode.UntilDone)
    lastTurn = "left"
}
function calcRigthDist () {
    rightDist = cuteBot.ultrasonic(cuteBot.SonarUnit.Centimeters)
}
function turnBack () {
    if (!(isOperating)) {
        return
    }
    cuteBot.stopcar()
    if (randint(0, 1) == 1) {
        music.play(music.tonePlayable(392, music.beat(BeatFraction.Sixteenth)), music.PlaybackMode.UntilDone)
        cuteBot.motors(-1 * turnSpeed, turnSpeed)
    } else {
        music.play(music.tonePlayable(784, music.beat(BeatFraction.Sixteenth)), music.PlaybackMode.UntilDone)
        cuteBot.motors(turnSpeed, -1 * turnSpeed)
    }
    basic.clearScreen()
    led.plot(4, 0)
    led.plot(0, 4)
    control.waitMicros(600000)
}
input.onButtonPressed(Button.A, function () {
    cuteBot.stopcar()
    isOperating = false
    cuteBot.closeheadlights()
})
// Valamilyen megoldás kell arra, hogy ha elakad a jármű, akkor kikeveredjen belőle.
// Az ötlet az, hogy nézzük a compass heading-et, és ha az nem változik, valamennyi ideig, akkor elakadt.
// Ekkor billen be a mustReverse.
function watchDog () {
    heading = input.compassHeading()
    if (Math.abs(heading - prevHeading) <= headingTreshold) {
        haltCounter += 1
    } else {
        haltCounter = 0
    }
    prevHeading = heading
    if (haltCounter > haltCounterMax) {
        mustReverse = true
        if (isOperating) {
            music.play(music.tonePlayable(988, music.beat(BeatFraction.Sixteenth)), music.PlaybackMode.UntilDone)
        }
    } else {
        mustReverse = false
    }
}
function reverse () {
    if (!(isOperating)) {
        return
    }
    cuteBot.stopcar()
    cuteBot.motors(-1 * turnSpeed, -1 * turnSpeed)
    basic.clearScreen()
    led.plot(0, 0)
    led.plot(4, 0)
    control.waitMicros(400000)
}
function init () {
    music.setVolume(44)
    isOperating = false
    mustReverse = false
    cuteBot.stopcar()
    haltCounterMax = 5
    headingTreshold = 20
    speed = 18
    turnSpeed = 25
    leftDistMin = 8
    rightDistMin = 8
    lastTurn = "left"
}
function calcLeftDist () {
    leftDist = sonar.ping(
    DigitalPin.P2,
    DigitalPin.P2,
    PingUnit.Centimeters
    )
}
function turnRight () {
    if (!(isOperating)) {
        return
    }
    cuteBot.motors(turnSpeed, -1 * turnSpeed)
    basic.clearScreen()
    led.plot(0, 2)
    music.play(music.createSoundExpression(WaveShape.Sine, 5000, 57, 244, 244, 100, SoundExpressionEffect.Warble, InterpolationCurve.Linear), music.PlaybackMode.UntilDone)
    lastTurn = "right"
}
input.onButtonPressed(Button.B, function () {
    isOperating = true
    cuteBot.colorLight(cuteBot.RGBLights.ALL, 0xffffff)
})
let leftDist = 0
let rightDistMin = 0
let leftDistMin = 0
let mustReverse = false
let haltCounterMax = 0
let haltCounter = 0
let headingTreshold = 0
let prevHeading = 0
let heading = 0
let rightDist = 0
let lastTurn = ""
let turnSpeed = 0
let speed = 0
let isOperating = false
init()
basic.forever(function () {
    calcRigthDist()
    calcLeftDist()
    watchDog()
    if (mustReverse) {
        reverse()
        turnBack()
    }
    if (rightDist < rightDistMin) {
        turnLeft()
    }
    if (leftDist < leftDistMin) {
        turnRight()
    }
    if (leftDist < leftDistMin && rightDist < rightDistMin) {
        reverse()
        turnBack()
    }
    if (leftDist >= leftDistMin && rightDist >= rightDistMin) {
        moveForward()
    }
})
