const {
	Sparky, FuseBox, UglifyJSPlugin, CSSPlugin, EnvPlugin, VueComponentPlugin,
	JSONPlugin, BabelPlugin, HotReloadPlugin, QuantumPlugin
} = require('fuse-box');
let producer;
let production = false;

Sparky.task("build", ()=> {
	const fuse = FuseBox.init({
		homeDir: "src",
		output: "dist/$name.js",
		package: 'vue-ripper',
		plugins: [
			EnvPlugin({NODE_ENV: production ? "production" : "development"}),
			CSSPlugin(),
			production && UglifyJSPlugin(),
			VueComponentPlugin(),
			JSONPlugin(),
			production && QuantumPlugin({
				bakeApiIntoBundle : 'vue-ripper',
				containedAPI : true,
				target: 'npm'
			})
		],
		cache: false,
		debug: !production, log: !production,
		package: {
			name: "vue-ripper",
			main: 'index.ts'
		},
		globals: {
			'vue-ripper': '*'
		}
	});

	const app = fuse.bundle("vue-ripper")
    	.instructions('!> [index.ts] - *.d.ts');

	return fuse.run();
});
Sparky.task("test", ()=> {
	const fuse = FuseBox.init({
		homeDir: ".",
		output: "test/$name.js",
		package: 'test',
		plugins: [
			EnvPlugin({NODE_ENV: production ? "production" : "development"}),
			CSSPlugin(), production && UglifyJSPlugin(),
			VueComponentPlugin(),
			JSONPlugin()
		],
		cache: false,
		debug: true, log: true,
		alias: {
			vue: 'vue/dist/vue.runtime.esm.js',
			'vue-ripper': '~/src/index'
		}
	});

	const test = fuse.bundle("test")
		.watch('(test|src)/**(vue|ts|html)')
		//.sourceMaps(true)
		//.plugin(HotReloadPlugin({port: 4445}))
		.instructions('!> [test/index.ts] - *.d.ts');
	
	const vendor = fuse.bundle("vendor")
		//.sourceMaps(true)
		//.plugin(HotReloadPlugin({port: 4445}))
		.instructions('~ [test/index.ts] +tslib');

	return fuse.run().then((fuseProducer)=> {
		producer = fuseProducer;
	});
});
// main task
Sparky.task("default", ["clean", "build"], ()=> {});
Sparky.task("on", ["build"], ()=> {});	//node fuse on
//Sparky.task("test", ["test"], ()=> {});	//node fuse on

// wipe it all
Sparky.task("clean", ()=> {
	return Promise.all([
		Sparky.src(".fusebox/*").clean(".fusebox/").exec(),
		Sparky.src("dist/*").clean("dist/").exec()
	]);
});

Sparky.task("set-production-env", ()=> production = true);
Sparky.task("dist", ["clean", "set-production-env", "build"], ()=> {})
