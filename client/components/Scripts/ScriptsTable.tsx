export const x = 1;
// import * as React from 'react';
// import * as style from './Scripts.css';
// import { ScriptRow } from './ScriptRow';
// import { Loader } from '../Loader/Loader';

// interface Props {
//   scripts: NpmGui.Script[];
//   scriptsProcessing: any;
//   onDeleteScript: (script: NpmGui.Script) => void;
//   onRunScript: (script: NpmGui.Script) => void;
// }

// export class ScriptsTable extends React.PureComponent<Props> {
//   isLoading(): boolean {
//     return !this.props.scripts;
//   }

//   isEmpty(): boolean {
//     return this.props.scripts && this.props.scripts.length === 0;
//   }

//   renderThs(): React.ReactNode {
//     const ths = [
//       { name: 'Run' },
//       { name: 'Name' },
//       { name: 'Command' },
//       { name: '' },
//     ];

//     return (ths.map((th) => (
//       <th>{th.name}</th>
//     )));
//   }

//   render(): React.ReactNode {
//     return (
//       <div className={style.tableContainer}>
//         <div className={style.infoContainer}>
//           {this.isEmpty() && <>empty...</>}
//           {this.isLoading() && (
//           <>
//             <Loader />
//             &nbsp;loading...
//           </>
//           )}
//         </div>
//         <table>
//           <thead>
//             <tr>
//               {this.renderThs()}
//             </tr>
//           </thead>
//           <tbody>
//             {
//               this.props.scripts
//               && this.props.scripts.map((script) => (
//                 <ScriptRow
//                   key={script.name}
//                   script={script}
//                   isProcessing={this.props.scriptsProcessing[script.name]}
//                   onDeleteScript={this.props.onDeleteScript}
//                   onRunScript={this.props.onRunScript}
//                 />
//               ))
//             }
//           </tbody>
//         </table>
//       </div>
//     );
//   }
// }
