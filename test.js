

let sql = "SELECT something, thatthing, @p1 AS p1 FROM atable WHERE athing = @p1 AND thing = @p2";

// transform sql to string with ? for params
// make map of named params to positions

const RX_PARAM = /@([a-z0-9_]+)/gi;
let nmap = {}, pcount = 0, pargs = [];


sql = sql.replace(RX_PARAM, (w,g,t) => {
    console.log(w);
    console.log(g);
    console.log(t);
    console.log('----');
    if(Object.hasOwn(nmap,g)) nmap[g].push(pcount);
    else nmap[g] = [pcount];

    pargs.push(g);
    pcount++;
    return '?';
});

console.log(sql);
console.log(nmap);
console.log(pargs);