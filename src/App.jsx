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

            container.addEventListener('dragover', (event) => {
                event.preventDefault();
            });

            container.addEventListener('drop', async (event) => {
                event.preventDefault();
                const componentName = event.dataTransfer.getData('component');
                const component = components.find(c => c.name === componentName);
                if (component) {
                    const node = await component.createNode({ num: 0 });
                    node.position = [event.offsetX, event.offsetY];
                    editor.addNode(node);
                    editor.trigger('process');
                }
            });
        };

        initRete();
    }, []);

    const handleDragStart = (event, componentName) => {
        event.dataTransfer.setData('component', componentName);
    };

    return (
        <div>
            <div className="sidebar">
                <h2>Blocks</h2>
                <div
                    className="block"
                    draggable
                    onDragStart={(event) => handleDragStart(event, 'Number')}
                >
                    Number Block
                </div>
                {/* Add more blocks here */}
            </div>
            <div id="rete"></div>
        </div>
    );
};

export default App;
