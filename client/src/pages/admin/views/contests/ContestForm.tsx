import { PlusIcon, TrashIcon } from '@heroicons/react/solid';
import { observer } from 'mobx-react';
import React, { useEffect, useState } from 'react';
import { getRandomHexColor, isEmpty } from '../../../../core/helpers';
import { Contest, ContestProblem, Problem } from '../../../../core/models';
import { rootStore } from '../../../../core/stores/RootStore';
import { DataTableItemForm } from '../../../shared/data-table/DataTable';
import { FormModal } from '../../../shared/dialogs';
import {
  CheckBoxField,
  DateTimeField,
  DropdownField,
  FormErrors,
  NumberField,
  TextField,
} from '../../../shared/extended-form';

const ContestForm: DataTableItemForm<Contest> = observer(
  ({ item: contest, isOpen, onClose, submit }) => {
    const [errors, setErrors] = useState<FormErrors<Contest>>({});
    const [problemsErrors, setProblemsErrors] = useState<{
      [index: number]: FormErrors<ContestProblem>;
    }>(
      contest.problems.map((p) => ({
        problem: isEmpty(p.problem),
        shortName: isEmpty(p.shortName),
      })),
    );
    const { data: problems, fetchAll } = rootStore.problemsStore;

    useEffect(() => {
      setErrors({
        name: isEmpty(contest.name),
        shortName: isEmpty(contest.shortName),
        activateTime: isEmpty(contest.activateTime),
        startTime: isEmpty(contest.startTime),
        endTime: isEmpty(contest.endTime),
      });
    }, [contest]);

    useEffect(() => {
      fetchAll();
    }, [fetchAll]);

    useEffect(() => {
      setProblemsErrors(
        contest.problems.map((p) => ({
          problem: isEmpty(p.problem),
          shortName: isEmpty(p.shortName),
        })),
      );
    }, [contest.problems]);

    const setProblemsErrorsByIndex = (index: number) => (errors: FormErrors<ContestProblem>) => {
      setProblemsErrors({ ...problemsErrors, [index]: errors });
    };

    return (
      <FormModal
        title={`${contest.id ? 'Update' : 'Create'} Contest`}
        isOpen={isOpen}
        onClose={onClose}
        onSubmit={() => submit(contest)}
        submitDisabled={
          (problemsErrors &&
            Object.values(problemsErrors).some((errors) => Object.values(errors).some((e) => e))) ||
          Object.values(errors).some((e) => e)
        }
      >
        <div className="grid sm:grid-cols-2 gap-2">
          <TextField<Contest>
            entity={contest}
            field="name"
            label="Name"
            required
            errors={errors}
            setErrors={setErrors}
          />
          <TextField<Contest>
            entity={contest}
            field="shortName"
            label="Short Name"
            required
            errors={errors}
            setErrors={setErrors}
          />
        </div>
        <div className="grid sm:grid-cols-3 gap-2">
          <DateTimeField<Contest>
            entity={contest}
            field="activateTime"
            label="Activate Time"
            required
            maxDate={contest.startTime}
            errors={errors}
            setErrors={setErrors}
          />
          <DateTimeField<Contest>
            entity={contest}
            field="startTime"
            label="Start Time"
            required
            disabled={!contest.activateTime}
            minDate={contest.activateTime}
            maxDate={contest.endTime}
            errors={errors}
            setErrors={setErrors}
          />
          <DateTimeField<Contest>
            entity={contest}
            field="endTime"
            label="End Time"
            required
            disabled={!contest.startTime}
            minDate={contest.startTime}
            errors={errors}
            setErrors={setErrors}
          />
        </div>
        <div className="grid sm:grid-cols-3 gap-2">
          <DateTimeField<Contest>
            entity={contest}
            field="freezeTime"
            label="Freeze Time"
            clearable
            disabled={!contest.startTime}
            minDate={contest.startTime}
            maxDate={contest.endTime}
            errors={errors}
            setErrors={setErrors}
          />
          <DateTimeField<Contest>
            entity={contest}
            field="unfreezeTime"
            label="Unfreeze Time"
            clearable
            disabled={!contest.freezeTime}
            minDate={contest.endTime}
            errors={errors}
            setErrors={setErrors}
          />
          <DateTimeField<Contest>
            entity={contest}
            field="finalizeTime"
            label="Finalize Time"
            clearable
            disabled={!contest.endTime}
            minDate={contest.endTime}
            errors={errors}
            setErrors={setErrors}
          />
        </div>
        <div className="grid sm:grid-cols-5 gap-2">
          <CheckBoxField<Contest>
            entity={contest}
            field="enabled"
            label="Enabled"
            defaultValue={true}
            errors={errors}
            setErrors={setErrors}
          />
          <CheckBoxField<Contest>
            entity={contest}
            field="public"
            label="Visible on public scoreboard"
            defaultValue={true}
            errors={errors}
            setErrors={setErrors}
          />
          <CheckBoxField<Contest>
            entity={contest}
            field="openToAllTeams"
            label="Open to all teams"
            defaultValue={false}
            errors={errors}
            setErrors={setErrors}
          />
          <CheckBoxField<Contest>
            entity={contest}
            field="verificationRequired"
            label="Verification required"
            defaultValue={false}
            errors={errors}
            setErrors={setErrors}
          />
          <CheckBoxField<Contest>
            entity={contest}
            field="processBalloons"
            label="Process balloons"
            defaultValue={true}
            errors={errors}
            setErrors={setErrors}
          />
        </div>
        <div className="mt-2 shadow border border-gray-200 rounded-md">
          <table className="table-fixed min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="w-1/4 p-3 text-center font-medium text-gray-700 uppercase tracking-wider">
                  Problem
                </th>
                <th className="w-1/6 p-3 text-center font-medium text-gray-700 uppercase tracking-wider">
                  Short Name
                </th>
                <th className="w-24 p-3 text-center font-medium text-gray-700 uppercase tracking-wider">
                  Points
                </th>
                <th className="w-32 p-3 text-center font-medium text-gray-700 uppercase tracking-wider">
                  Allow Submit
                </th>
                <th className="w-32 p-3 text-center font-medium text-gray-700 uppercase tracking-wider">
                  Allow Judge
                </th>
                <th className="w-36 p-3 text-center font-medium text-gray-700 uppercase tracking-wider">
                  Color
                </th>
                <th className="p-3 text-center font-medium text-gray-700 uppercase tracking-wider" />
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-y-200">
              {!contest.problems.length && (
                <tr>
                  <td className="p-3 text-center bg-gray-50 opacity-50" colSpan={7}>
                    Add problems
                  </td>
                </tr>
              )}
              {contest.problems.map((problem, index) => (
                <tr key={`${contest.id}-${index}`} className="divide-x divide-x-200">
                  <td className="p-3">
                    <DropdownField<ContestProblem>
                      entity={problem}
                      field="problem"
                      placeHolder="Select Problem"
                      required
                      options={problems}
                      optionsIdField="id"
                      optionsTextField="name"
                      errors={problemsErrors[index]}
                      setErrors={setProblemsErrorsByIndex(index)}
                      onChange={(value: Problem) => {
                        problem.problem = problems.find((p) => p.id === value.id)!;
                        contest.problems.forEach(
                          (cp, index) =>
                            (problemsErrors[index].problem =
                              isEmpty(problemsErrors[index].problem) ||
                              contest.problems.filter(
                                (p) => p.problem && cp.problem && p.problem.id === cp.problem.id,
                              ).length > 1),
                        );
                        setProblemsErrors(problemsErrors);
                      }}
                    />
                  </td>
                  <td className="p-3">
                    <TextField<ContestProblem>
                      entity={problem}
                      field="shortName"
                      required
                      errors={problemsErrors[index]}
                      onChange={() => {
                        contest.problems.forEach((cp, index) => {
                          problemsErrors[index].shortName =
                            isEmpty(cp.shortName) ||
                            contest.problems.filter(
                              (p) =>
                                p.shortName &&
                                cp.shortName &&
                                p.shortName.trim() === cp.shortName.trim(),
                            ).length > 1;
                        });
                        setProblemsErrors(problemsErrors);
                      }}
                      setErrors={(errors) => {
                        problemsErrors[index] = errors;
                        setProblemsErrors(problemsErrors);
                      }}
                    />
                  </td>
                  <td className="p-3">
                    <NumberField<ContestProblem>
                      entity={problem}
                      field="points"
                      min={1}
                      defaultValue={1}
                    />
                  </td>
                  <td className="p-3">
                    <div className="flex items-center justify-center">
                      <CheckBoxField<ContestProblem>
                        entity={problem}
                        field="allowSubmit"
                        defaultValue={true}
                      />
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center justify-center">
                      <CheckBoxField<ContestProblem>
                        entity={problem}
                        field="allowJudge"
                        defaultValue={true}
                      />
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center justify-center">
                      <input
                        type="color"
                        value={problem.color ?? ''}
                        onChange={({ target: { value } }) => (problem.color = value)}
                      />
                    </div>
                  </td>
                  <td className="p-3 cursor-pointer hover:bg-red-50">
                    <div className="flex items-center justify-center">
                      <TrashIcon
                        className="text-red-600 w-6 h-6"
                        onClick={() =>
                          (contest.problems = contest.problems.filter((_, i) => i !== index))
                        }
                      />
                    </div>
                  </td>
                </tr>
              ))}
              <tr>
                <td
                  className="p-2 cursor-pointer bg-gray-50 hover:bg-gray-100"
                  colSpan={7}
                  onClick={() =>
                    (contest.problems = [
                      ...contest.problems,
                      { color: getRandomHexColor() } as ContestProblem,
                    ])
                  }
                >
                  <div className="flex items-center justify-center">
                    <PlusIcon className="w-8 h-8" />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </FormModal>
    );
  },
);

export default ContestForm;
