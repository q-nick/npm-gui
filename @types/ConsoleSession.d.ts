interface ConsoleSession {
  id: string;
  status: 'NEW' | 'ERROR' | 'CLOSE';
  msg: string;
}
