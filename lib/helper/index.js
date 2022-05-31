export const renderPoliceStation = (s) => {
  switch (s) {
    case 'drug-1':
      return 'กองบัญชาการตำรวจปราบปรามยาเสพติด 1';
    case 'drug-2':
      return 'กองบัญชาการตำรวจปราบปรามยาเสพติด 2';
    case 'drug-3':
      return 'กองบัญชาการตำรวจปราบปรามยาเสพติด 3';
    case 'drug-4':
      return 'กองบัญชาการตำรวจปราบปรามยาเสพติด 4';
    default:
      return s;
  }
};
