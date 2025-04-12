import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';


interface LastSeenPropsI {
  notSeenNum: number,
  markAsRead: () => void
}

const LastSeen = ({notSeenNum, markAsRead}: LastSeenPropsI) => {
    return (
      <>
        <Divider>
          <Chip label={notSeenNum} size="small" onClick={markAsRead} />
        </Divider>
      </>
    );
}

export default LastSeen;