import React, { useEffect } from 'react';
import Rete from 'rete';
import ConnectionPlugin from 'rete-connection-plugin';
import VueRenderPlugin from 'rete-vue-render-plugin';
import ContextMenuPlugin from 'rete-context-menu-plugin';

const App = () => {
    useEffect(() => {
        const initRete = async () => {
            const container = document.querySelector('#rete');
            const editor = new Rete.NodeEditor('demo@0.1.0', container);
            editor.use(ConnectionPlugin);
            editor.use(VueRenderPlugin);
            editor.use(ContextMenuPlugin);

            const engine = new Rete.Engine('demo@0.1.0');

            const numSocket = new Rete.Socket('Number value');

            class NumComponent extends Rete.Component {
                constructor() {
                    super('Number');
                }

                builder(node) {
                    const out1 = new Rete.Output('num', 'Number', numSocket);

                    return node.addOutput(out1);
                }

                worker(node, inputs, outputs) {
                    outputs['num'] = node.data.num;
                }
            }

            const components = [new NumComponent()];

            components.forEach(c => {
                editor.register(c);
                engine.register(c);
            });

            editor.on('process nodecreated noderemoved connectioncreated connectionremoved', async () => {
                await engine.abort();
                await engine.process(editor.toJSON());
            });

            editor.view.resize();
            editor.trigger('process');
            container.addEventListener('resize', () => editor.view.resize());

            const defaultNode = await components[0].createNode({ num: 0 });
            defaultNode.position = [container.clientWidth / 2, container.clientHeight / 2];
            editor.addNode(defaultNode);
            editor.trigger('process');
        };

        initRete();
    }, []);

    return (
        <div>
            <div id="rete"></div>
        </div>
    );
};

export default App;
