import type { FeatureBadgeType } from "@/utils/localTypes";
import { FEATURE_FLAGS_OPTIONS } from "@/utils/localConsts";
import NewBadge from "./NewBadge";
import SoonBadge from "./SoonBadge";

interface FeatureBadgeProps {
  type: FeatureBadgeType;
  children?: React.ReactNode;
}

const FeatureBadge = ({ type, children }: FeatureBadgeProps) => {
  return (
    <div className="flex items-center gap-2">
      {children && children}

      {type === FEATURE_FLAGS_OPTIONS.SOON && <SoonBadge />}
      {type === FEATURE_FLAGS_OPTIONS.NEW && <NewBadge />}
      {/* {type === FEATURE_FLAGS_OPTIONS.ALPAH && <AlphaBadge />}
      {type === FEATURE_FLAGS_OPTIONS.BETA && <BetaBadge />} */}
    </div>
  );
};

export default FeatureBadge;
