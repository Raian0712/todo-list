import { Input } from 'antd';
import { ChangeEventHandler } from 'react';

const { TextArea } = Input;

type Props = {
  value: string
  onChange: ChangeEventHandler<HTMLTextAreaElement>
}
const InputBox: React.FC<Props> = ({ value, onChange }) => {
  return (
    <div>
      <TextArea autoSize={{ minRows: 3, maxRows: 5 }} value={value} onChange={onChange}/>
    </div>
  );
}

export default InputBox;