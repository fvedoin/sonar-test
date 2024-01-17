export const getGroupInterval = (start: Date, end: Date) => {
  let interval: string;
  if (end.getTime() - start.getTime() <= 86400000) {
    //menos que 1 dia
    interval = '15m';
  } else if (
    end.getTime() - start.getTime() > 86400000 &&
    end.getTime() - start.getTime() <= 172800000
  ) {
    //entre 1 e 2 dias
    interval = '30m';
  } else if (
    end.getTime() - start.getTime() > 172800000 &&
    end.getTime() - start.getTime() <= 691200000
  ) {
    //entre 2 e 8 dias
    interval = '1h';
  } else if (
    end.getTime() - start.getTime() > 691200000 &&
    end.getTime() - start.getTime() <= 2592000000
  ) {
    //entre 8 e 30 dias
    interval = '6h';
  } else if (
    end.getTime() - start.getTime() > 2592000000 &&
    end.getTime() - start.getTime() <= 15552000000
  ) {
    //entre 30 e 180 dias
    interval = '12h';
  } else if (
    end.getTime() - start.getTime() > 15552000000 &&
    end.getTime() - start.getTime() <= 31540000000
  ) {
    //entre 180 e dias 365 (1 ano)
    interval = '1d';
  } else if (
    end.getTime() - start.getTime() > 31540000000 &&
    end.getTime() - start.getTime() <= 63080000000
  ) {
    //entre 365 dias e 730 dias (2 anos)
    interval = '2d';
  } else if (
    end.getTime() - start.getTime() > 63080000000 &&
    end.getTime() - start.getTime() <= 94620000000
  ) {
    //entre 365 dias e 1095 dias (3 anos)
    interval = '3d';
  } else {
    interval = '6d';
  }
  return interval;
};
