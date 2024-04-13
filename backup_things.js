function asd_very_jumpy_collision(other) {
    // this works, but its very jumpy
    // 1) kinda looks good, with g=2, and without "cooling" 
    //   buuut not really useful
    // 2) g=4, and 0.8 cooling:  also ok, but a bit too "flowy"
    let dist = this.pos.distance(other.pos)

    if (dist <= this.r + other.r) {
        if (this.r === other.r) {
            //
        } else {
            let diff = this.r + other.r - dist
            let a1 = other.r / (this.r + other.r)
            let a2 = this.r / (this.r + other.r)
            console.log(`diff: ${diff}, a1: ${a1}, a2: ${a2}`)

            let d1 = this.pos.newDiff(other.pos).multiply(a1)
            let d2 = other.pos.newDiff(this.pos).multiply(a2)
            console.log('1')
            console.log(`d1(${d1.x},${d1.y}) `)
            console.log(`d2(${d2.x},${d2.y}) `)

            console.log('2')
            let randomX = Math.random() - 0.5


            // d1.multiply(0.3)   //  <-----  set this to maybe 0.2 for less jumpy, but still a bit jittery(?)
            this.pos.add(d1)
            console.log('3')


            //   d2.multiply(0.3)
            other.pos.add(d2)
            console.log('3')
        }
    }
}

function asd_rugalmas_utkozes_plus(other) {
    //  mix of the jumpy thing, and the elastic collision thigy
    // kinda weird, still jumpy
    let dist = this.pos.distance(other.pos)

    if (dist <= this.r + other.r) {
        if (this.r === other.r) {
            //
        } else {
            let diff = this.r + other.r - dist
            let a1 = other.r / (this.r + other.r)
            let a2 = this.r / (this.r + other.r)
            console.log(`diff: ${diff}, a1: ${a1}, a2: ${a2}`)

            let v1 = this.pos.newDiff(this.lastPos)
            let v2 = other.pos.newDiff(other.lastPos)

            let u1 = v1.newMultiply((this.r - other.r) / (this.r + other.r)).add(
                v2.newMultiply((2 * other.r) / (this.r + other.r))
            )
            let u2 = v2.newMultiply((other.r - this.r) / (this.r + other.r)).add(
                v1.newMultiply((2 * this.r) / (this.r + other.r))
            )

            // in fact this below is a bug
            //  the `u1` and `u2` already contain the ratio by m (well now using r for that)
            // but it causes an effect, like some liquid would move from side to side
            let d1 = this.pos.newDiff(other.pos).add(u1).multiply(a1 * 0.1)
            let d2 = other.pos.newDiff(this.pos).add(u2).multiply(a2 * 0.1)
            console.log('1')
            console.log(`d1(${d1.x},${d1.y}) `)
            console.log(`d2(${d2.x},${d2.y}) `)

            console.log('2')
            let randomX = Math.random() - 0.5

            // this.lastPos = this.pos.copy()
            // if (d1.x == 0) {
            //     d1.x = randomX
            // }
            // d1.multiply(0.8)
            this.pos.add(d1)
            console.log('3')

            // other.lastPos = other.pos.copy()
            // if (d2.x == 0) {
            //     d2.x = -randomX
            // }
            //  d2.multiply(0.8)
            other.pos.add(d2)
            console.log('3')
        }
    }
}


// this below tries to simulate an elastic collision-like thing,  
//   well, it does not work
function asd_rugalmas_utkozes(other) {
    let dist = this.pos.distance(other.pos)

    if (dist <= this.r + other.r) {
        if (this.r === other.r) {
            //
        } else {
            let diff = this.r + other.r - dist
            let a1 = other.r / (this.r + other.r)
            let a2 = this.r / (this.r + other.r)
            console.log(`diff: ${diff}, a1: ${a1}, a2: ${a2}`)

            let v1 = this.pos.newDiff(this.lastPos)
            let v2 = other.pos.newDiff(other.lastPos)

            let u1 = v1.newMultiply((this.r - other.r) / (this.r + other.r)).add(
                v2.newMultiply((2 * other.r) / (this.r + other.r))
            )
            let u2 = v2.newMultiply((other.r - this.r) / (this.r + other.r)).add(
                v1.newMultiply((2 * this.r) / (this.r + other.r))
            )
            let d1 = u1
            let d2 = u2

            console.log('1')
            console.log(`d1(${d1.x},${d1.y}) `)
            console.log(`d2(${d2.x},${d2.y}) `)

            console.log('2')
            let randomX = Math.random() - 0.5

            // this.lastPos = this.pos.copy()
            // if (d1.x == 0) {
            //     d1.x = randomX
            // }
            // d1.multiply(0.8)
            this.pos.add(d1)
            console.log('3')

            // other.lastPos = other.pos.copy()
            // if (d2.x == 0) {
            //     d2.x = -randomX
            // }
            //  d2.multiply(0.8)
            other.pos.add(d2)
            console.log('3')
        }
    }
}