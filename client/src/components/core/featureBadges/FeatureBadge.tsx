import { types, consts } from "@eleads/shared";
import NewBadge from "./NewBadge";
import SoonBadge from "./SoonBadge";

interface FeatureBadgeProps {
  type: types.FeatureBadgeType;
  children?: React.ReactNode;
}

const FeatureBadge = ({ type, children }: FeatureBadgeProps) => {
  return (
    <div className="flex items-center gap-2">
      {children && children}

      {type === consts.featureFlagTextOptions.SOON && <SoonBadge />}
      {type === consts.featureFlagTextOptions.NEW && <NewBadge />}
      {/* {type === FEATURE_FLAGS_OPTIONS.ALPAH && <AlphaBadge />}
      {type === FEATURE_FLAGS_OPTIONS.BETA && <BetaBadge />} */}
    </div>
  );
};

export default FeatureBadge;
