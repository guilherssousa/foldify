import React from "react";
import { View } from "react-native";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";

export function TweetSkeleton() {
  return (
    <View>
      <SkeletonPlaceholder>
        <SkeletonPlaceholder.Item
          flexDirection="row"
          alignItems="center"
          marginTop={22}
        >
          <SkeletonPlaceholder.Item marginLeft={20}>
            <SkeletonPlaceholder.Item flexDirection="row" alignItems="center">
              <SkeletonPlaceholder.Item
                width={120}
                height={20}
                borderRadius={4}
              />
              <SkeletonPlaceholder.Item
                width={40}
                height={20}
                borderRadius={4}
                marginLeft={8}
              />
            </SkeletonPlaceholder.Item>
            <SkeletonPlaceholder.Item
              marginTop={12}
              width={300}
              height={20}
              borderRadius={4}
            />
            <SkeletonPlaceholder.Item
              marginTop={12}
              width={300}
              height={20}
              borderRadius={4}
            />
            <SkeletonPlaceholder.Item
              marginTop={12}
              width={240}
              height={20}
              borderRadius={4}
            />
          </SkeletonPlaceholder.Item>
        </SkeletonPlaceholder.Item>
      </SkeletonPlaceholder>
    </View>
  );
}
