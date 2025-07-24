import { Button, Container, Group, Text, Title } from "@mantine/core";
import Illustration from "@/assets/icons/Illustration";
import classes from "./NothingFoundBg.module.css";

const NothingFoundBg = () => {
  return (
    <Container className={`${classes.root} ${classes.fullScreen}`}>
      <div className={classes.inner}>
        <Illustration className={classes.image} />
        <div className={classes.content}>
          <Title className={classes.title}>Nothing to see here</Title>
          <Text c="dimmed" size="lg" ta="center" className={classes.description}>
            Page you are trying to open does not exist. You may have mistyped the address, or the
            page has been moved to another URL. If you think this is an error contact support.
          </Text>
          <Group justify="center">
            <Button size="md">Take me back to home page</Button>
          </Group>
        </div>
      </div>
    </Container>
  );
};

export default NothingFoundBg;
