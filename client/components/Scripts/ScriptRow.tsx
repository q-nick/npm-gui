export const x = 1;
// import * as React from 'react';
// import * as style from './Scripts.css';
// import { Button } from '../../ui/Button/Button';
// import { ConfirmButton } from '../../ui/ConfirmButton/ConfirmButton';

// interface Props {
//   script: NpmGui.Script;
//   isProcessing: boolean;
//   onDeleteScript: (script: NpmGui.Script) => void;
//   onRunScript: (script: NpmGui.Script) => void;
// }

// export class ScriptRow extends React.PureComponent<Props> {
//   onDeleteScript = (): void => {
//     this.props.onDeleteScript(this.props.script);
//   }

//   onRunScript = (): void => {
//     this.props.onRunScript(this.props.script);
//   }

//   render(): React.ReactNode {
//     const { name, command } = this.props.script;
//     return (
//       <tr
//         key={name}
//         className={this.props.isProcessing && style.processing}
//       >
//         <td>
//           <Button
//             disabled={this.props.isProcessing}
//             icon="media-play"
//             variant="info"
//             scale="small"
//             onClick={this.onRunScript}
//           >
//             run
//           </Button>
//         </td>
//         <td>{name}</td>
//         <td><pre className={style.command}>{command}</pre></td>
//         <td>
//           <ConfirmButton
//             disabled={this.props.isProcessing}
//             icon="trash"
//             variant="danger"
//             scale="small"
//             onClick={this.onDeleteScript}
//           />
//         </td>
//       </tr>
//     );
//   }
// }
