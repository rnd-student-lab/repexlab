import moment from 'moment';
import {
  chalkMsg, msgTypes, emojiMsg, icons
} from './formatter';

const now = () => moment().format('HH:mm:ss');

export const logSuccess = msg => console.log(`[${now()}] ${chalkMsg(msg, msgTypes.SUCCESS)}`);

export const logInfo = msg => console.log(`[${now()}] ${chalkMsg(msg, msgTypes.INFO)}`);

export const logError = msg => console.log(`[${now()}] ${chalkMsg(msg, msgTypes.ERROR)}`);

export const logWarning = msg => console.log(`[${now()}] ${chalkMsg(msg, msgTypes.WARNING)}`);

export const logProcessingStep = (msg, step, totalStep) => {
  const steps = chalkMsg(`[${step}/${totalStep}]`, msgTypes.FADED);
  console.log(`${steps} ${chalkMsg(msg, msgTypes.INFO)}`);
};

export const logScream = msg => {
  const scream = emojiMsg(icons.SCREAM);
  console.log(
    `${scream} ${scream} ${scream}  ${chalkMsg(
      msg,
      msgTypes.SCREAM
    )}  ${scream} ${scream} ${scream}`
  );
};
