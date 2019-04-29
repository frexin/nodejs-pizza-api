import {StatusList} from "../entity/status";

export class StatusResolver {


    static getAllowedNextSteps(currentStep:Number):Array<number> {
        let result:Array<number> = [];

        switch (currentStep) {
            case StatusList.New:
                result = [StatusList.InProgress, StatusList.Canceled];
                break;
            case StatusList.InProgress:
                result = [StatusList.Completed];
                break;
        }


        return result;
    }
}
