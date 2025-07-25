import { Flex, Button } from "@radix-ui/themes";
import Illustration from "@/assets/icons/Illustration";
import classes from "./NothingFoundBg.module.css";
import { useNavigate } from "react-router-dom";

const NothingFoundBg = () => {
  const navigate = useNavigate();

  return (
    <div className={`${classes.root} ${classes.fullScreen}`}>
      <div className={classes.inner}>
        <Illustration className={classes.image} />
        <div className={classes.content}>
          <div className={classes.title}>Nothing to see here</div>
          <div className={classes.description}>
            Page you are trying to open does not exist. You may have mistyped the address, or the
            page has been moved to another URL. If you think this is an error contact support.
          </div>
          <Flex justify="center">
            <Button size="3" onClick={() => navigate("/home")}>
              Take me back to home page
            </Button>
          </Flex>
        </div>
      </div>
    </div>
  );
};

export default NothingFoundBg;
